package com.salon.backend.dto.common;

import java.util.List;
import java.util.UUID;

public record BarberRequest(
        String name,
        String phone,
        String email,
        List<String> specialties,
        Boolean active,
        UUID branchId
) {
}
