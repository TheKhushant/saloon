package com.salon.backend.dto.auth;

import jakarta.validation.constraints.Email;

public record UserProfileUpdateRequest(
        String name,
        @Email String email,
        String phone
) {
}
