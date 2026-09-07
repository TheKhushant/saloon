package com.salon.backend.service;

import com.salon.backend.entity.Booking;
import com.salon.backend.entity.Branch;
import com.salon.backend.entity.Holiday;
import com.salon.backend.entity.SalonService;
import com.salon.backend.repository.BookingRepository;
import com.salon.backend.repository.BranchRepository;
import com.salon.backend.repository.HolidayRepository;
import com.salon.backend.repository.SalonServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

    private final BookingRepository bookingRepository;
    private final HolidayRepository holidayRepository;
    private final SettingsService settingsService;
    private final SalonServiceRepository serviceRepository;
    private final BranchRepository branchRepository;

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    public record BookedSlot(String time, UUID barberId) {
    }

    public record Availability(
            boolean closed,
            Holiday holiday,
            List<BookedSlot> bookedSlots,
            int maxBookingsPerSlot,
            // How many of the branch-wide capacity are still open at each
            // time that has at least one booking. A time with no bookings
            // yet simply won't appear here - the frontend should treat any
            // time absent from this map as fully open (maxBookingsPerSlot
            // remaining). This lets the storefront grey out full slots
            // without a separate request per time.
            Map<String, Integer> remainingCapacityByTime
    ) {
    }

    public Availability check(UUID branchId, LocalDate date, UUID barberId) {
        List<Holiday> holidays = holidayRepository.findForBranchAndDate(branchId, date);
        // Prefer a branch-specific holiday over a global one if both exist.
        Optional<Holiday> holiday = holidays.stream()
                .filter(h -> h.getBranch() != null)
                .findFirst()
                .or(() -> holidays.stream().findFirst());

        List<Booking> bookings = bookingRepository.findByBranchIdAndDateBetween(branchId, date, date).stream()
                .filter(b -> b.getStatus() == com.salon.backend.entity.BookingStatus.PENDING
                        || b.getStatus() == com.salon.backend.entity.BookingStatus.CONFIRMED)
                .toList();

        List<BookedSlot> slots = bookings.stream()
                .filter(b -> barberId == null || (b.getBarberRef() != null && b.getBarberRef().getId().equals(barberId)))
                .map(b -> new BookedSlot(b.getTime(), b.getBarberRef() != null ? b.getBarberRef().getId() : null))
                .toList();

        int capacity = settingsService.get().getMaxBookingsPerSlot();
        Map<String, Integer> remainingByTime = bookings.stream()
                .collect(Collectors.groupingBy(Booking::getTime, Collectors.collectingAndThen(
                        Collectors.counting(), count -> (int) Math.max(0, capacity - count))));

        boolean closed = holiday.map(Holiday::isClosedAllDay).orElse(false);
        return new Availability(closed, holiday.orElse(null), slots, capacity, remainingByTime);
    }

    public record EarliestSlot(UUID branchId, String branchName, LocalDate date, String time) {
    }

    /**
     * For a given service, finds the soonest open slot at EACH branch that
     * offers it (one result per branch, sorted earliest-first) - lets a
     * customer compare "where can I get this fastest" across the whole
     * salon chain instead of committing to a branch before even knowing
     * when it's actually free. Uses the exact same per-slot capacity check
     * (countActiveForSlot vs. Settings.maxBookingsPerSlot) as the real
     * booking path, so a slot shown here is guaranteed bookable, not an
     * optimistic guess that then 409s.
     */
    public List<EarliestSlot> earliestAcrossBranches(UUID serviceId, int daysAhead) {
        SalonService service = serviceRepository.findById(serviceId).orElse(null);
        if (service == null || !service.isActive()) {
            return List.of();
        }

        List<Branch> candidateBranches = service.getBranch() != null
                ? List.of(service.getBranch())
                : branchRepository.findAll().stream().filter(Branch::isActive).toList();

        var settings = settingsService.get();
        List<String> daySlots = timesOfDay(settings.getOpenTime(), settings.getCloseTime(), settings.getSlotDurationMinutes());
        int capacity = settings.getMaxBookingsPerSlot();

        List<EarliestSlot> results = new ArrayList<>();

        for (Branch branch : candidateBranches) {
            EarliestSlot found = null;

            outer:
            for (int dayOffset = 0; dayOffset < daysAhead; dayOffset++) {
                LocalDate date = LocalDate.now().plusDays(dayOffset);

                boolean closed = holidayRepository.findForBranchAndDate(branch.getId(), date).stream()
                        .anyMatch(Holiday::isClosedAllDay);
                if (closed) continue;

                for (String time : daySlots) {
                    if (dayOffset == 0 && isPast(time)) continue;

                    long active = bookingRepository.countActiveForSlot(branch.getId(), date, time);
                    if (active < capacity) {
                        found = new EarliestSlot(branch.getId(), branch.getName(), date, time);
                        break outer;
                    }
                }
            }

            if (found != null) {
                results.add(found);
            }
        }

        return results.stream()
                .sorted((a, b) -> {
                    int byDate = a.date().compareTo(b.date());
                    return byDate != 0 ? byDate : a.time().compareTo(b.time());
                })
                .toList();
    }

    private boolean isPast(String time) {
        return LocalTime.parse(time, TIME_FMT).isBefore(LocalTime.now());
    }

    private List<String> timesOfDay(String openTime, String closeTime, int slotDurationMinutes) {
        List<String> slots = new ArrayList<>();
        LocalTime cursor = LocalTime.parse(openTime, TIME_FMT);
        LocalTime close = LocalTime.parse(closeTime, TIME_FMT);
        while (cursor.isBefore(close)) {
            slots.add(cursor.format(TIME_FMT));
            cursor = cursor.plusMinutes(slotDurationMinutes);
        }
        return slots;
    }
}
