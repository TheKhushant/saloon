package com.salon.backend.controller;

import com.salon.backend.dto.common.SettingsRequest;
import com.salon.backend.entity.Settings;
import com.salon.backend.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping
    public Settings get() {
        return settingsService.get();
    }

    // Accept both PUT and PATCH on the same handler - the frontend calls
    // this with PATCH (a partial-update-flavored client), while PUT is the
    // more semantically "correct" verb for a full settings replace. Both
    // route to the same update logic so neither client sees a 405.
    @PutMapping
    @PatchMapping
    @PreAuthorize("hasRole('SUPERADMIN')")
    public Settings update(@RequestBody SettingsRequest request) {
        return settingsService.update(request);
    }
}
