package com.salon.backend.dto.common;

import java.math.BigDecimal;
import java.time.Instant;

public record OfferRequest(
        String title,
        String code,
        String discountType,     // "PERCENTAGE" or "FIXED"
        BigDecimal discountValue,
        Boolean active,
        Instant expiresAt,
        String description
) {
}
