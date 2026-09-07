package com.salon.backend.controller;

import com.salon.backend.dto.booking.BookingCreateRequest;
import com.salon.backend.entity.*;
import com.salon.backend.exception.ResourceNotFoundException;
import com.salon.backend.repository.*;
import com.salon.backend.security.AuthContext;
import com.salon.backend.service.AvailabilityService;
import com.salon.backend.service.BookingService;
import com.salon.backend.service.SettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final BranchRepository branchRepository;
    private final SalonServiceRepository serviceRepository;
    private final ProductRepository productRepository;
    private final BarberRepository barberRepository;
    private final OfferRepository offerRepository;
    private final SettingsService settingsService;
    private final AvailabilityService availabilityService;
    private final BookingService bookingService;

    @GetMapping("/branches")
    public List<Branch> branches() {
        return branchRepository.findAll().stream().filter(Branch::isActive).toList();
    }

    @GetMapping("/services")
    public List<SalonService> services(@RequestParam(required = false) String category,
                                        @RequestParam(required = false) UUID branchId) {
        return serviceRepository.findByActiveTrue().stream()
                .filter(s -> s.getApprovalStatus() == ApprovalStatus.APPROVED)
                .filter(s -> category == null || category.equalsIgnoreCase(s.getCategory()))
                .filter(s -> branchId == null || s.getBranch() == null || s.getBranch().getId().equals(branchId))
                .toList();
    }

    @GetMapping("/services/{id}")
    public SalonService service(@PathVariable UUID id) {
        return serviceRepository.findById(id)
                .filter(SalonService::isActive)
                .filter(s -> s.getApprovalStatus() == ApprovalStatus.APPROVED)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
    }

    @GetMapping("/products")
    public List<Product> products(@RequestParam(required = false) String category) {
        return productRepository.findAll().stream()
                .filter(Product::isActive)
                .filter(p -> p.getApprovalStatus() == ApprovalStatus.APPROVED)
                .filter(p -> category == null || p.getCategory().name().equalsIgnoreCase(category))
                .toList();
    }

    @GetMapping("/barbers")
    public List<Barber> barbers(@RequestParam(required = false) UUID branchId) {
        List<Barber> all = branchId != null ? barberRepository.findByBranchId(branchId) : barberRepository.findAll();
        return all.stream().filter(Barber::isActive).toList();
    }

    @GetMapping("/offers")
    public List<Offer> offers() {
        return offerRepository.findAll().stream()
                .filter(Offer::isActive)
                .filter(o -> o.getApprovalStatus() == ApprovalStatus.APPROVED)
                .filter(o -> o.getExpiresAt() == null || o.getExpiresAt().isAfter(Instant.now()))
                .toList();
    }

    @PostMapping("/offers/validate")
    public Offer validateOffer(@RequestBody java.util.Map<String, String> body) {
        String code = body.get("code");
        return offerRepository.findByCodeIgnoreCaseAndActiveTrue(code != null ? code : "")
                .filter(o -> o.getApprovalStatus() == ApprovalStatus.APPROVED)
                .filter(o -> o.getExpiresAt() == null || o.getExpiresAt().isAfter(Instant.now()))
                .orElseThrow(() -> new ResourceNotFoundException("Offer code is invalid or expired"));
    }

    @GetMapping("/settings")
    public Settings settings() {
        return settingsService.get();
    }

    @GetMapping("/availability")
    public AvailabilityService.Availability availability(
            @RequestParam UUID branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) UUID barberId
    ) {
        return availabilityService.check(branchId, date, barberId);
    }

    @GetMapping("/services/{serviceId}/earliest-availability")
    public List<AvailabilityService.EarliestSlot> earliestAvailability(
            @PathVariable UUID serviceId,
            @RequestParam(defaultValue = "14") int daysAhead
    ) {
        return availabilityService.earliestAcrossBranches(serviceId, Math.min(daysAhead, 30));
    }

    @PostMapping("/bookings")
    @ResponseStatus(HttpStatus.CREATED)
    public Booking createBooking(@Valid @RequestBody BookingCreateRequest request) {
        return bookingService.createPublicBooking(request, AuthContext.currentOrNull());
    }

    @GetMapping("/bookings/mine")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<Booking> myBookings() {
        return bookingService.myBookings(AuthContext.current().id());
    }
}
