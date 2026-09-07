package com.salon.backend.controller;

import com.salon.backend.dto.booking.BookingCreateRequest;
import com.salon.backend.dto.booking.BookingUpdateRequest;
import com.salon.backend.entity.Booking;
import com.salon.backend.security.BranchScope;
import com.salon.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping("/upcoming")
    public List<Booking> upcoming(@RequestParam(required = false) UUID branchId,
                                   @RequestParam(defaultValue = "10") int limit) {
        return bookingService.upcoming(BranchScope.resolve(branchId), limit);
    }

    @GetMapping
    public List<Booking> list(@RequestParam(required = false) UUID branchId,
                               @RequestParam(required = false) String status,
                               @RequestParam(required = false) String search,
                               @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate from,
                               @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate to,
                               @RequestParam(defaultValue = "500") int limit) {
        return bookingService.search(BranchScope.resolve(branchId), status, search, from, to, Math.min(limit, 500));
    }

    @GetMapping("/{id}")
    public Booking get(@PathVariable UUID id) {
        return bookingService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Booking create(@Valid @RequestBody BookingCreateRequest request) {
        return bookingService.createAdminBooking(request);
    }

    @PatchMapping("/{id}")
    public Booking update(@PathVariable UUID id, @RequestBody BookingUpdateRequest request) {
        return bookingService.update(id, request);
    }

    // Dedicated sub-routes matching what the admin/superadmin frontends
    // actually call - each just delegates to the same partial update as
    // PATCH /{id}, with the other fields left null (unchanged).
    @PatchMapping("/{id}/status")
    public Booking updateStatus(@PathVariable UUID id, @RequestBody StatusUpdateRequest request) {
        return bookingService.update(id, new BookingUpdateRequest(null, null, null, request.status(), null, null, null, null));
    }

    @PatchMapping("/{id}/reschedule")
    public Booking reschedule(@PathVariable UUID id, @RequestBody RescheduleRequest request) {
        return bookingService.update(id, new BookingUpdateRequest(null, null, null, null, null, null, request.date(), request.time()));
    }

    public record StatusUpdateRequest(String status) {
    }

    public record RescheduleRequest(java.time.LocalDate date, String time) {
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        bookingService.delete(id);
    }
}
