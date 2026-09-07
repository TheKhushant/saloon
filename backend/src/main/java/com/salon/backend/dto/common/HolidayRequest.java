package com.salon.backend.dto.common;

import java.time.LocalDate;
import java.util.UUID;

public record HolidayRequest(
        LocalDate date,
        String reason,
        Boolean closedAllDay,
        String openTime,
        String closeTime,
        UUID branchId
) {
}
