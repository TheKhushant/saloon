package com.salon.backend.dto.payment;

public record PaymentUpdateRequest(
        String status,          // PENDING | PAID | FAILED | REFUNDED
        String method,          // CASH | CARD | UPI | WALLET | OTHER
        String transactionRef
) {
}
