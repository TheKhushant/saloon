package com.salon.backend.dto.booking;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;
import java.util.UUID;

public record BookingCreateRequest(
        @NotBlank String customerName,
        @NotBlank String customerPhone,
        @Email String customerEmail,

        @NotNull UUID serviceId,
        UUID barberId,
        @NotNull UUID branchId,

        @NotNull LocalDate date,
        @NotBlank @Pattern(regexp = "^([01]\\d|2[0-3]):([0-5]\\d)$", message = "time must be HH:mm") String time,

        String notes,
        String offerCode
        // total is intentionally absent - always computed server-side from
        // the Service price (see BookingService.computeTotal).
) {
}
