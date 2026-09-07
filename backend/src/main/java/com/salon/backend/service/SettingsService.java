package com.salon.backend.service;

import com.salon.backend.dto.common.SettingsRequest;
import com.salon.backend.entity.Settings;
import com.salon.backend.repository.SettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final SettingsRepository settingsRepository;

    @Transactional
    public Settings get() {
        return settingsRepository.findAll().stream().findFirst()
                .orElseGet(() -> settingsRepository.save(Settings.builder().build()));
    }

    @Transactional
    public Settings update(SettingsRequest request) {
        Settings current = get();

        if (request.businessName() != null) current.setBusinessName(request.businessName());
        if (request.phone() != null) current.setPhone(request.phone());
        if (request.email() != null) current.setEmail(request.email());
        if (request.address() != null) current.setAddress(request.address());
        if (request.currency() != null) current.setCurrency(request.currency());
        if (request.timezone() != null) current.setTimezone(request.timezone());
        if (request.openTime() != null) current.setOpenTime(request.openTime());
        if (request.closeTime() != null) current.setCloseTime(request.closeTime());
        if (request.slotDurationMinutes() != null) current.setSlotDurationMinutes(request.slotDurationMinutes());
        if (request.maxBookingsPerSlot() != null) current.setMaxBookingsPerSlot(request.maxBookingsPerSlot());
        if (request.allowOnlineBooking() != null) current.setAllowOnlineBooking(request.allowOnlineBooking());
        if (request.requireDepositForBooking() != null) current.setRequireDepositForBooking(request.requireDepositForBooking());
        if (request.depositPercentage() != null) current.setDepositPercentage(request.depositPercentage());

        return settingsRepository.save(current);
    }
}
