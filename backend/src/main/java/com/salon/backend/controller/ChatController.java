package com.salon.backend.controller;

import com.salon.backend.dto.chat.ChatRequest;
import com.salon.backend.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/public/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // No fixed timeout on the emitter itself (0 = never times out server-side)
    // - the client's fetch/EventSource controls how long it waits, and the
    // underlying Anthropic call has its own 60s HttpRequest timeout in
    // ChatService, which is what actually bounds a stuck request.
    private static final long EMITTER_TIMEOUT_MS = 0L;

    @PostMapping(path = "/stream", produces = "text/event-stream")
    public SseEmitter stream(@Valid @RequestBody ChatRequest request) {
        SseEmitter emitter = new SseEmitter(EMITTER_TIMEOUT_MS);

        List<ChatService.ChatMessage> history = request.messages().stream()
                .map(m -> new ChatService.ChatMessage(m.role(), m.content()))
                .toList();

        chatService.streamReply(history, emitter);
        return emitter;
    }
}
