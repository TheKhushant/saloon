package com.salon.backend.dto.common;

import jakarta.validation.constraints.NotBlank;

// Used for both create and patch. On create, name is required and active
// defaults to true if omitted. On patch, only non-null fields are applied.
public record BranchRequest(
        String name,
        String address,
        String phone,
        Boolean active
) {
}
