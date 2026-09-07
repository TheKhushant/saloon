package com.salon.backend.dto.booking;

// Admin-side partial update. All fields optional; only non-null fields are
// applied. Unlike BookingCreateRequest, admins ARE allowed to override the
// total directly (e.g. manual discount at checkout), since they're a
// trusted authenticated actor rather than an anonymous public client.
public record BookingUpdateRequest(
        String customerName,
        String customerPhone,
        String customerEmail,
        String status,
        String notes,
        java.math.BigDecimal total,
        java.time.LocalDate date,
        String time
) {
}
