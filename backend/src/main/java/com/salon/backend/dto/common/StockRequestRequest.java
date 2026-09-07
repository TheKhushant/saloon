package com.salon.backend.dto.common;

import java.util.UUID;

public record StockRequestRequest(
        UUID productId,
        UUID branchId
) {
}
