package com.salon.backend.service;

import com.salon.backend.dto.booking.BookingCreateRequest;
import com.salon.backend.dto.booking.BookingUpdateRequest;
import com.salon.backend.entity.*;
import com.salon.backend.exception.ApiException;
import com.salon.backend.exception.ConflictException;
import com.salon.backend.exception.ResourceNotFoundException;
import com.salon.backend.repository.*;
import com.salon.backend.security.AuthPrincipal;
import com.salon.backend.security.AuthRole;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SalonServiceRepository serviceRepository;
    private final BarberRepository barberRepository;
    private final BranchRepository branchRepository;
    private final OfferRepository offerRepository;
    private final CustomerRepository customerRepository;
    private final AppUserRepository appUserRepository;
    private final SettingsService settingsService;
    private final PaymentRepository paymentRepository;

    private record PriceResult(BigDecimal total, String serviceName) {
    }

    /**
     * The single source of truth for booking price. Never trust a total sent
     * by an anonymous/public client - always recompute it from the current
     * Service price (and an optional valid Offer code) here.
     */
    private PriceResult computeTotal(UUID serviceId, String offerCode, boolean requireApproval) {
        var query = serviceRepository.findById(serviceId).filter(SalonService::isActive);
        if (requireApproval) {
            query = query.filter(s -> s.getApprovalStatus() == ApprovalStatus.APPROVED);
        }
        SalonService service = query.orElseThrow(() -> new ResourceNotFoundException("Selected service is not available"));

        BigDecimal total = service.getPrice();

        if (offerCode != null && !offerCode.isBlank()) {
            var offerOpt = offerRepository.findByCodeIgnoreCaseAndActiveTrue(offerCode);
            if (offerOpt.isPresent()) {
                Offer offer = offerOpt.get();
                boolean expired = offer.getExpiresAt() != null && offer.getExpiresAt().isBefore(java.time.Instant.now());
                boolean approved = offer.getApprovalStatus() == ApprovalStatus.APPROVED;
                if (!expired && approved) {
                    total = offer.getDiscountType() == DiscountType.PERCENTAGE
                            ? total.multiply(BigDecimal.ONE.subtract(offer.getDiscountValue().divide(BigDecimal.valueOf(100))))
                                    .setScale(2, RoundingMode.HALF_UP)
                            : total.subtract(offer.getDiscountValue()).max(BigDecimal.ZERO);
                }
            }
        }

        return new PriceResult(total, service.getName());
    }

    @Transactional
    public Booking createPublicBooking(BookingCreateRequest request, AuthPrincipal principal) {
        return createBooking(request, principal, true);
    }

    /** Admin-created bookings (e.g. walk-ins) skip the approval-status gate -
     *  an admin can already see and manage pending/rejected catalog items in
     *  their dashboard, so it isn't blocked from being booked directly; the
     *  gate only protects what anonymous customers can reach. Slot capacity
     *  and double-booking checks still apply identically either way. */
    @Transactional
    public Booking createAdminBooking(BookingCreateRequest request) {
        return createBooking(request, null, false);
    }

    private Booking createBooking(BookingCreateRequest request, AuthPrincipal principal, boolean requireApproval) {
        PriceResult price = computeTotal(request.serviceId(), request.offerCode(), requireApproval);
        Branch branch = branchRepository.findById(request.branchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));

        // Acquire a transaction-scoped lock on this exact branch+date+time
        // slot BEFORE counting existing bookings, so two concurrent requests
        // for the last open spot can't both read "4 booked, capacity 5" and
        // both insert - the second request blocks here until the first
        // transaction commits or rolls back, then sees the updated count.
        bookingRepository.lockSlot(slotLockKey(branch.getId(), request.date(), request.time()));

        long activeInSlot = bookingRepository.countActiveForSlot(branch.getId(), request.date(), request.time());
        Settings settings = settingsService.get();
        if (activeInSlot >= settings.getMaxBookingsPerSlot()) {
            throw new ConflictException("This time slot is fully booked. Please choose another time.");
        }

        Barber barber = null;
        if (request.barberId() != null) {
            barber = barberRepository.findById(request.barberId())
                    .orElseThrow(() -> new ResourceNotFoundException("Barber not found"));
            assertSlotFree(branch.getId(), barber.getId(), request.date(), request.time());
        }

        // Deposit requirement is snapshotted from the salon-wide setting at
        // the moment of booking, not re-evaluated later - so changing the
        // setting afterward doesn't retroactively change what an existing
        // booking already required of the customer.
        boolean depositRequired = settings.isRequireDepositForBooking();
        BigDecimal depositAmount = depositRequired
                ? price.total()
                        .multiply(BigDecimal.valueOf(settings.getDepositPercentage()))
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP)
                : null;

        Booking booking = Booking.builder()
                .bookingRef(nextBookingRef())
                .customerName(request.customerName())
                .customerPhone(request.customerPhone())
                .customerEmail(request.customerEmail())
                .service(price.serviceName())
                .salonService(serviceRepository.getReferenceById(request.serviceId()))
                .barber(barber != null ? barber.getName() : null)
                .barberRef(barber)
                .branch(branch)
                .branchName(branch.getName())
                .date(request.date())
                .time(request.time())
                .total(price.total())
                .depositRequired(depositRequired)
                .depositAmount(depositAmount)
                .status(BookingStatus.PENDING)
                .notes(request.notes())
                .user(principal != null && principal.role() == AuthRole.CUSTOMER
                        ? appUserRepository.getReferenceById(principal.id())
                        : null)
                .build();

        Booking saved = bookingRepository.save(booking);
        syncCustomerRecord(saved);

        if (depositRequired) {
            // Tracks that a deposit is owed. This does NOT collect a real
            // payment - there's no payment gateway wired up yet (Razorpay/
            // Stripe would go here). An admin marks it paid once collected
            // in person/by other means, via PaymentController.
            paymentRepository.save(Payment.builder()
                    .booking(saved)
                    .type(PaymentType.DEPOSIT)
                    .amount(depositAmount)
                    .status(PaymentStatus.PENDING)
                    .build());
        }

        return saved;
    }

    private void assertSlotFree(UUID branchId, UUID barberId, LocalDate date, String time) {
        List<Booking> clashes = bookingRepository.findClashingSlot(branchId, barberId, date, time);
        if (!clashes.isEmpty()) {
            throw new ConflictException("That time slot has just been booked. Please choose another.");
        }
    }

    private String slotLockKey(UUID branchId, LocalDate date, String time) {
        return branchId + "|" + date + "|" + time;
    }

    private void syncCustomerRecord(Booking booking) {
        customerRepository.findByPhone(booking.getCustomerPhone()).ifPresentOrElse(
                customer -> {
                    customer.setTotalBookings(customer.getTotalBookings() + 1);
                    customer.setTotalSpent(customer.getTotalSpent().add(booking.getTotal()));
                    customerRepository.save(customer);
                },
                () -> customerRepository.save(Customer.builder()
                        .name(booking.getCustomerName())
                        .phone(booking.getCustomerPhone())
                        .email(booking.getCustomerEmail())
                        .branch(booking.getBranch())
                        .totalBookings(1)
                        .totalSpent(booking.getTotal())
                        .build())
        );
    }

    private String nextBookingRef() {
        // Simple, human-friendly counter. Under concurrent inserts this can
        // theoretically collide; the DB's UNIQUE constraint on booking_ref
        // will reject a collision rather than silently duplicate one - retry
        // the request in that (extremely rare) case.
        long count = bookingRepository.count();
        return String.format("BK-%06d", count + 1);
    }

    public List<Booking> search(UUID branchId, String status, String search, LocalDate from, LocalDate to, int limit) {
        org.springframework.data.jpa.domain.Specification<Booking> spec =
                org.springframework.data.jpa.domain.Specification.where(null);

        if (branchId != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("branch").get("id"), branchId));
        }
        if (status != null && !status.isBlank()) {
            BookingStatus statusEnum;
            try {
                statusEnum = BookingStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid status: " + status);
            }
            spec = spec.and((root, q, cb) -> cb.equal(root.get("status"), statusEnum));
        }
        if (from != null) {
            spec = spec.and((root, q, cb) -> cb.greaterThanOrEqualTo(root.get("date"), from));
        }
        if (to != null) {
            spec = spec.and((root, q, cb) -> cb.lessThanOrEqualTo(root.get("date"), to));
        }
        if (search != null && !search.isBlank()) {
            String like = "%" + search.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> cb.or(
                    cb.like(cb.lower(root.get("customerName")), like),
                    cb.like(root.get("customerPhone"), like),
                    cb.like(cb.lower(root.get("bookingRef")), like)));
        }

        var sort = org.springframework.data.domain.Sort.by("date").ascending().and(org.springframework.data.domain.Sort.by("time").ascending());
        return bookingRepository.findAll(spec, PageRequest.of(0, limit, sort)).getContent();
    }

    public List<Booking> upcoming(UUID branchId, int limit) {
        return bookingRepository.findUpcoming(branchId, PageRequest.of(0, limit));
    }

    public List<Booking> myBookings(UUID userId) {
        return bookingRepository.findByUserIdOrderByDateDesc(userId);
    }

    public Booking findById(UUID id) {
        return bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }

    @Transactional
    public Booking update(UUID id, BookingUpdateRequest request) {
        Booking booking = findById(id);
        if (request.customerName() != null) booking.setCustomerName(request.customerName());
        if (request.customerPhone() != null) booking.setCustomerPhone(request.customerPhone());
        if (request.customerEmail() != null) booking.setCustomerEmail(request.customerEmail());
        if (request.notes() != null) booking.setNotes(request.notes());
        if (request.total() != null) booking.setTotal(request.total());
        if (request.date() != null) booking.setDate(request.date());
        if (request.time() != null) booking.setTime(request.time());
        if (request.status() != null) {
            try {
                booking.setStatus(BookingStatus.valueOf(request.status().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid status: " + request.status());
            }
        }
        return bookingRepository.save(booking);
    }

    @Transactional
    public void delete(UUID id) {
        if (!bookingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Booking not found");
        }
        bookingRepository.deleteById(id);
    }
}
