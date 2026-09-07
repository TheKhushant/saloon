package com.salon.backend.dto.auth;

public record MessageResponse(String message, String devResetToken) {
    public MessageResponse(String message) {
        this(message, null);
    }
}
