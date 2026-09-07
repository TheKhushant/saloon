package com.salon.backend.dto.common;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record SalonServiceRequest(
        String name,
        String category,
        Integer durationMinutes,
        BigDecimal price,
        Boolean active,
        String description,
        UUID branchId,
        String image,
        BigDecimal rating,
        Integer stylists,
        Integer popularity,
        BigDecimal originalPrice,
        List<String> tags,
        List<String> benefits
) {
}
