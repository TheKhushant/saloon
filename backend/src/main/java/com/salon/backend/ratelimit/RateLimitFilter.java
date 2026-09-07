package com.salon.backend.ratelimit;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * A minimal in-memory, per-IP, fixed-window rate limiter.
 *
 * This is intentionally simple - it's fine for a single-instance deployment,
 * but it does NOT share state across multiple app instances. If you scale
 * horizontally, replace this with a shared store (Redis + Bucket4j) so all
 * instances enforce the same limit.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE) // run before Spring Security's filter chain
public class RateLimitFilter extends OncePerRequestFilter {

    @Value("${app.rate-limit.auth.capacity}")
    private int authCapacity;

    @Value("${app.rate-limit.auth.window-minutes}")
    private int authWindowMinutes;

    @Value("${app.rate-limit.booking.capacity}")
    private int bookingCapacity;

    @Value("${app.rate-limit.booking.window-minutes}")
    private int bookingWindowMinutes;

    @Value("${app.rate-limit.chat.capacity}")
    private int chatCapacity;

    @Value("${app.rate-limit.chat.window-minutes}")
    private int chatWindowMinutes;

    @Value("${app.rate-limit.general.capacity}")
    private int generalCapacity;

    @Value("${app.rate-limit.general.window-minutes}")
    private int generalWindowMinutes;

    private final Map<String, Window> buckets = new ConcurrentHashMap<>();

    private record Window(Instant windowStart, int count) {
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();
        RuleMatch rule = resolveRule(path);

        if (rule != null) {
            String key = rule.name + ":" + clientIp(request);
            if (!allow(key, rule.capacity, rule.windowMinutes)) {
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write("{\"message\":\"Too many requests, please try again later.\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private record RuleMatch(String name, int capacity, int windowMinutes) {
    }

    private RuleMatch resolveRule(String path) {
        if (path.startsWith("/api/auth/")) {
            return new RuleMatch("auth", authCapacity, authWindowMinutes);
        }
        if (path.equals("/api/public/bookings")) {
            return new RuleMatch("booking", bookingCapacity, bookingWindowMinutes);
        }
        if (path.equals("/api/public/chat/stream")) {
            // Every request here is a real LLM API call that costs real
            // money - this is deliberately tighter than the booking limit.
            return new RuleMatch("chat", chatCapacity, chatWindowMinutes);
        }
        if (path.startsWith("/api/")) {
            return new RuleMatch("general", generalCapacity, generalWindowMinutes);
        }
        return null;
    }

    private boolean allow(String key, int capacity, int windowMinutes) {
        Instant now = Instant.now();
        Window updated = buckets.compute(key, (k, existing) -> {
            if (existing == null || Duration.between(existing.windowStart(), now).toMinutes() >= windowMinutes) {
                return new Window(now, 1);
            }
            return new Window(existing.windowStart(), existing.count() + 1);
        });
        return updated.count() <= capacity;
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
