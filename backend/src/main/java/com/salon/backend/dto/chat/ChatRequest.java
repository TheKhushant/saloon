package com.salon.backend.dto.chat;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ChatRequest(
        @NotEmpty
        @Size(max = 20, message = "Conversation history is too long for a single request")
        @Valid
        List<Message> messages
) {
    public record Message(
            @Pattern(regexp = "user|assistant", message = "role must be 'user' or 'assistant'")
            String role,

            @NotBlank
            @Size(max = 2000, message = "Message is too long (max 2000 characters)")
            String content
    ) {
    }
}
