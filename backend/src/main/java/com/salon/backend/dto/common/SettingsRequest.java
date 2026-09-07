package com.salon.backend.dto.common;

public record SettingsRequest(
        String businessName,
        String phone,
        String email,
        String address,
        String currency,
        String timezone,
        String openTime,
        String closeTime,
        Integer slotDurationMinutes,
        Integer maxBookingsPerSlot,
        Boolean allowOnlineBooking,
        Boolean requireDepositForBooking,
        Integer depositPercentage
) {
}
