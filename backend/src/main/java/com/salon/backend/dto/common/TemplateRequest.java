// package com.salon.backend.dto.common;

// import java.math.BigDecimal;
// import java.util.List;

// public record TemplateRequest(
//         String name,
//         String category,        // MODERN | CLASSIC | LUXURY | INDUSTRIAL | MINIMALIST | PREMIUM
//         String status,           // ACTIVE | DRAFT | FEATURED | ARCHIVED
//         String description,
//         String imageUrl,
//         String beforeImageUrl,
//         String afterImageUrl,
//         String suitableFor,
//         BigDecimal budgetMin,
//         BigDecimal budgetMax,
//         Integer setupDays,
//         BigDecimal rating,
//         String version,
//         List<String> images,
//         List<String> themeColors,
//         List<String> furniture,
//         List<String> tags,
//         List<CostItemRequest> costBreakdown
// ) {
//     public record CostItemRequest(String label, BigDecimal amount) {
//     }
// }
package com.salon.backend.dto.common;

import java.math.BigDecimal;
import java.util.List;

public record TemplateRequest(
        String name,
        String category,        // MODERN | CLASSIC | LUXURY | INDUSTRIAL | MINIMALIST | PREMIUM
        String status,           // ACTIVE | DRAFT | FEATURED | ARCHIVED
        String description,
        String imageUrl,
        String beforeImageUrl,
        String afterImageUrl,
        String suitableFor,
        BigDecimal budgetMin,
        BigDecimal budgetMax,
        Integer setupDays,
        BigDecimal rating,
        String version,
        String createdBy,
        List<String> images,
        List<String> themeColors,
        List<String> furniture,
        List<String> tags,
        List<CostItemRequest> costBreakdown
) {
    public record CostItemRequest(String label, BigDecimal amount) {
    }
}