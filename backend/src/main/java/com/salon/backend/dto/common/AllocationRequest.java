package com.salon.backend.dto.common;

import java.time.LocalDate;
import java.util.UUID;

public record AllocationRequest(
        UUID branchId,
        Integer quantity,
        LocalDate assignedDate,
        String status   // ASSIGNED | PENDING
) {
}
