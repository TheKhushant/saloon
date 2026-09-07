package com.salon.backend.dto.auth;

import java.util.UUID;

public record AuthResponse(
        UUID id,
        String name,
        String email,
        String role,
        UUID branchId,
        String token
) {
}
