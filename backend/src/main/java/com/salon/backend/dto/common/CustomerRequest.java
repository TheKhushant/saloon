package com.salon.backend.dto.common;

import java.util.UUID;

public record CustomerRequest(
        String name,
        String phone,
        String email,
        Boolean active,
        String notes,
        UUID branchId
) {
}
