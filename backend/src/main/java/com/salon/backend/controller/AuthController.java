package com.salon.backend.controller;

import com.salon.backend.dto.auth.*;
import com.salon.backend.entity.Admin;
import com.salon.backend.entity.AppUser;
import com.salon.backend.security.AuthContext;
import com.salon.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /* ------------------------------- Admin ------------------------------- */

    @PostMapping("/admin/login")
    public AuthResponse loginAdmin(@Valid @RequestBody AdminLoginRequest request) {
        return authService.loginAdmin(request);
    }

    @PostMapping("/admin/register")
    @PreAuthorize("hasRole('SUPERADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse registerAdmin(@Valid @RequestBody AdminRegisterRequest request) {
        return authService.registerAdmin(request);
    }

    @GetMapping("/admin/me")
    public Admin adminProfile() {
        return authService.getAdminProfile(AuthContext.current().id());
    }

    @PostMapping("/admin/forgot-password")
    public MessageResponse forgotAdminPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return authService.forgotAdminPassword(request.email());
    }

    @PostMapping("/admin/reset-password")
    public MessageResponse resetAdminPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return authService.resetAdminPassword(request.token(), request.password());
    }

    /* ------------------------------ Customer ------------------------------ */

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse signup(@Valid @RequestBody UserSignupRequest request) {
        return authService.signupUser(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody UserLoginRequest request) {
        return authService.loginUser(request);
    }

    @GetMapping("/me")
    public AppUser userProfile() {
        return authService.getUserProfile(AuthContext.current().id());
    }

    @PatchMapping("/me")
    public AppUser updateUserProfile(@RequestBody UserProfileUpdateRequest request) {
        return authService.updateUserProfile(AuthContext.current().id(), request);
    }

    @PostMapping("/forgot-password")
    public MessageResponse forgotUserPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return authService.forgotUserPassword(request.email());
    }

    @PostMapping("/reset-password")
    public MessageResponse resetUserPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return authService.resetUserPassword(request.token(), request.password());
    }
}
