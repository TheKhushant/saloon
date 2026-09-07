package com.salon.backend.dto.common;

import java.time.LocalDate;
import java.util.UUID;

public record AssignmentRequest(
        UUID branchId,
        LocalDate assignedDate,
        String status   // ASSIGNED | PENDING
) {
}
