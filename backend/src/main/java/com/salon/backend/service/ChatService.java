package com.salon.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.salon.backend.entity.ApprovalStatus;
import com.salon.backend.repository.BranchRepository;
import com.salon.backend.repository.OfferRepository;
import com.salon.backend.repository.SalonServiceRepository;
import com.salon.backend.repository.SettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final SalonServiceRepository serviceRepository;
    private final BranchRepository branchRepository;
    private final OfferRepository offerRepository;
    private final SettingsRepository settingsRepository;

    @Value("${app.chat.anthropic-api-key}")
    private String apiKey;

    @Value("${app.chat.model}")
    private String model;

    @Value("${app.chat.max-tokens}")
    private int maxTokens;

    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private static final ObjectMapper MAPPER = new ObjectMapper();

    public record ChatMessage(String role, String content) {
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    /**
     * Streams a reply token-by-token onto the given emitter as SSE events:
     *   data: {"type":"delta","text":"..."}
     *   data: {"type":"done"}
     *   data: {"type":"error","message":"..."}
     * Runs on a virtual thread so it doesn't tie up a servlet worker thread
     * for the (potentially several-second) duration of the LLM call.
     */
    public void streamReply(List<ChatMessage> history, SseEmitter emitter) {
        Thread.ofVirtual().start(() -> {
            try {
                if (!isConfigured()) {
                    sendEvent(emitter, "error", "The chat assistant isn't configured yet - ANTHROPIC_API_KEY is missing on the server.");
                    emitter.complete();
                    return;
                }

                String requestBody = buildRequestBody(history);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("https://api.anthropic.com/v1/messages"))
                        .header("x-api-key", apiKey)
                        .header("anthropic-version", "2023-06-01")
                        .header("content-type", "application/json")
                        .timeout(Duration.ofSeconds(60))
                        .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                        .build();

                HttpResponse<java.io.InputStream> response =
                        HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofInputStream());

                if (response.statusCode() != 200) {
                    String errBody = new String(response.body().readAllBytes(), StandardCharsets.UTF_8);
                    log.warn("Anthropic API returned {}: {}", response.statusCode(), errBody);
                    sendEvent(emitter, "error", "The chat assistant is temporarily unavailable. Please try again shortly.");
                    emitter.complete();
                    return;
                }

                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(response.body(), StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        if (!line.startsWith("data:")) continue;
                        String json = line.substring(5).trim();
                        if (json.isEmpty()) continue;

                        JsonNode node = MAPPER.readTree(json);
                        String type = node.path("type").asText("");

                        if ("content_block_delta".equals(type)) {
                            String text = node.path("delta").path("text").asText("");
                            if (!text.isEmpty()) {
                                sendEvent(emitter, "delta", text);
                            }
                        } else if ("message_stop".equals(type)) {
                            break;
                        } else if ("error".equals(type)) {
                            sendEvent(emitter, "error", node.path("error").path("message").asText("Unknown error"));
                            emitter.complete();
                            return;
                        }
                    }
                }

                sendEvent(emitter, "done", "");
                emitter.complete();
            } catch (Exception e) {
                log.error("Chat stream failed", e);
                try {
                    sendEvent(emitter, "error", "Something went wrong. Please try again.");
                    emitter.complete();
                } catch (Exception ignored) {
                    // emitter may already be closed
                }
            }
        });
    }

    private void sendEvent(SseEmitter emitter, String type, String text) throws Exception {
        ObjectNode payload = MAPPER.createObjectNode();
        payload.put("type", type);
        if (!text.isEmpty() || "delta".equals(type)) {
            payload.put("text", text);
        }
        emitter.send(SseEmitter.event().data(MAPPER.writeValueAsString(payload)));
    }

    private String buildRequestBody(List<ChatMessage> history) throws Exception {
        ObjectNode root = MAPPER.createObjectNode();
        root.put("model", model);
        root.put("max_tokens", maxTokens);
        root.put("stream", true);
        root.put("system", buildSystemPrompt());

        ArrayNode messages = root.putArray("messages");
        for (ChatMessage m : history) {
            ObjectNode msg = messages.addObject();
            msg.put("role", "assistant".equals(m.role()) ? "assistant" : "user");
            msg.put("content", m.content());
        }

        return MAPPER.writeValueAsString(root);
    }

    /**
     * Grounds the assistant in real, current business data pulled fresh from
     * the database on every request - services/prices/branches/offers here
     * are never stale and never hallucinated, since the model is only ever
     * shown what's actually approved and active right now.
     */
    private String buildSystemPrompt() {
        var settings = settingsRepository.findAll().stream().findFirst();
        String businessName = settings.map(s -> s.getBusinessName()).orElse("the salon");

        StringBuilder sb = new StringBuilder();
        sb.append("You are a friendly, helpful assistant for ").append(businessName)
                .append(", a salon booking platform. Answer customer questions about services, ")
                .append("pricing, branch locations, hours, and current offers using ONLY the ")
                .append("information below - do not invent services, prices, or availability that ")
                .append("aren't listed here. If asked something you don't have data for (e.g. exact ")
                .append("appointment availability), tell the customer to check the booking page or ")
                .append("contact the branch directly. Keep answers short and conversational, ")
                .append("suited for a chat widget. Current date/time: ").append(Instant.now()).append(".\n\n");

        sb.append("## Available services\n");
        serviceRepository.findByActiveTrue().stream()
                .filter(s -> s.getApprovalStatus() == ApprovalStatus.APPROVED)
                .forEach(s -> sb.append("- ").append(s.getName())
                        .append(" (").append(s.getDurationMinutes()).append(" min, ")
                        .append(s.getPrice()).append(")")
                        .append(s.getCategory() != null ? " - category: " + s.getCategory() : "")
                        .append("\n"));

        sb.append("\n## Branches\n");
        branchRepository.findAll().stream()
                .filter(b -> b.isActive())
                .forEach(b -> sb.append("- ").append(b.getName())
                        .append(b.getAddress() != null ? ", " + b.getAddress() : "")
                        .append(b.getPhone() != null ? " (phone: " + b.getPhone() + ")" : "")
                        .append("\n"));

        sb.append("\n## Current offers\n");
        var activeOffers = offerRepository.findAll().stream()
                .filter(o -> o.isActive() && o.getApprovalStatus() == ApprovalStatus.APPROVED)
                .filter(o -> o.getExpiresAt() == null || o.getExpiresAt().isAfter(Instant.now()))
                .toList();
        if (activeOffers.isEmpty()) {
            sb.append("(no active offers right now)\n");
        } else {
            activeOffers.forEach(o -> sb.append("- ").append(o.getTitle())
                    .append(" (code ").append(o.getCode()).append("): ")
                    .append(o.getDiscountValue())
                    .append(o.getDiscountType().name().equals("PERCENTAGE") ? "% off" : " off")
                    .append("\n"));
        }

        settings.ifPresent(s -> sb.append("\n## Hours\n")
                .append("Open ").append(s.getOpenTime()).append(" - ").append(s.getCloseTime()).append(" daily.\n"));

        return sb.toString();
    }
}
