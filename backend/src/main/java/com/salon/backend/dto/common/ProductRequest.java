package com.salon.backend.dto.common;

import java.math.BigDecimal;
import java.util.List;

public record ProductRequest(
        String name,
        String category,       // HAIR_CARE | BEARD_CARE | SKIN_CARE | TOOLS
        BigDecimal price,
        Integer totalStock,
        Boolean comingSoon,
        Boolean active,
        String description,
        String imageUrl,
        BigDecimal rating,
        Integer reviewCount,
        String tag,
        String howToUse,
        List<String> benefits,
        List<String> ingredients
) {
}
