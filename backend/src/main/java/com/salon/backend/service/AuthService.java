package com.salon.backend.service;

import com.salon.backend.dto.auth.*;
import com.salon.backend.entity.Admin;
import com.salon.backend.entity.AdminRole;
import com.salon.backend.entity.AppUser;
import com.salon.backend.entity.Branch;
import com.salon.backend.exception.ApiException;
import com.salon.backend.exception.ConflictException;
import com.salon.backend.exception.ResourceNotFoundException;
import com.salon.backend.repository.AdminRepository;
import com.salon.backend.repository.AppUserRepository;
import com.salon.backend.repository.BranchRepository;
import com.salon.backend.security.AuthRole;
import com.salon.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminRepository adminRepository;
    private final AppUserRepository appUserRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private static final SecureRandom RANDOM = new SecureRandom();
    private final org.springframework.core.env.Environment environment;

    /* ------------------------------ Admin auth ------------------------------ */

    public AuthResponse loginAdmin(AdminLoginRequest request) {
        Admin admin = adminRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        if (!admin.isActive()) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Admin account is inactive");
        }
        if (!passwordEncoder.matches(request.password(), admin.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid password");
        }

        UUID branchId = admin.getBranch() != null ? admin.getBranch().getId() : null;
        AuthRole role = admin.getRole() == AdminRole.SUPERADMIN ? AuthRole.SUPERADMIN : AuthRole.ADMIN;
        String token = jwtService.issue(admin.getId(), role, branchId);

        return new AuthResponse(admin.getId(), admin.getName(), admin.getEmail(), admin.getRole().name(), branchId, token);
    }

    @Transactional
    public AuthResponse registerAdmin(AdminRegisterRequest request) {
        if (adminRepository.existsByEmailIgnoreCase(request.email())) {
            throw new ConflictException("An admin with that email already exists");
        }

        AdminRole role = "SUPERADMIN".equalsIgnoreCase(request.role()) ? AdminRole.SUPERADMIN : AdminRole.ADMIN;

        Branch branch = null;
        if (request.branchId() != null) {
            branch = branchRepository.findById(request.branchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
        }

        Admin admin = Admin.builder()
                .name(request.name())
                .email(request.email().toLowerCase())
                .password(passwordEncoder.encode(request.password()))
                .role(role)
                .branch(branch)
                .active(true)
                .build();
        adminRepository.save(admin);

        UUID branchId = branch != null ? branch.getId() : null;
        return new AuthResponse(admin.getId(), admin.getName(), admin.getEmail(), admin.getRole().name(), branchId, null);
    }

    public Admin getAdminProfile(UUID id) {
        return adminRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
    }

    @Transactional
    public MessageResponse forgotAdminPassword(String email) {
        var adminOpt = adminRepository.findByEmailIgnoreCase(email);
        if (adminOpt.isEmpty()) {
            return new MessageResponse("If that account exists, a reset link has been sent");
        }
        Admin admin = adminOpt.get();
        String rawToken = generateToken();
        admin.setResetPasswordToken(hash(rawToken));
        admin.setResetPasswordExpires(Instant.now().plus(1, ChronoUnit.HOURS));
        adminRepository.save(admin);

        return devToken(rawToken);
    }

    @Transactional
    public MessageResponse resetAdminPassword(String rawToken, String newPassword) {
        Admin admin = adminRepository.findByResetPasswordToken(hash(rawToken))
                .filter(a -> a.getResetPasswordExpires() != null && a.getResetPasswordExpires().isAfter(Instant.now()))
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Reset token is invalid or has expired"));

        admin.setPassword(passwordEncoder.encode(newPassword));
        admin.setResetPasswordToken(null);
        admin.setResetPasswordExpires(null);
        adminRepository.save(admin);

        return new MessageResponse("Password updated successfully");
    }

    /* ----------------------------- Customer auth ----------------------------- */

    @Transactional
    public AuthResponse signupUser(UserSignupRequest request) {
        if (appUserRepository.existsByEmailIgnoreCase(request.email())) {
            throw new ConflictException("An account with that email already exists");
        }

        AppUser user = AppUser.builder()
                .name(request.name())
                .email(request.email().toLowerCase())
                .phone(request.phone())
                .password(passwordEncoder.encode(request.password()))
                .build();
        appUserRepository.save(user);

        String token = jwtService.issue(user.getId(), AuthRole.CUSTOMER, null);
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), "CUSTOMER", null, token);
    }

    public AuthResponse loginUser(UserLoginRequest request) {
        AppUser user = appUserRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid password");
        }

        String token = jwtService.issue(user.getId(), AuthRole.CUSTOMER, null);
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), "CUSTOMER", null, token);
    }

    public AppUser getUserProfile(UUID id) {
        return appUserRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public AppUser updateUserProfile(UUID id, com.salon.backend.dto.auth.UserProfileUpdateRequest request) {
        AppUser user = getUserProfile(id);

        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name());
        }
        if (request.email() != null && !request.email().isBlank()
                && !request.email().equalsIgnoreCase(user.getEmail())) {
            if (appUserRepository.existsByEmailIgnoreCase(request.email())) {
                throw new ConflictException("Another account already uses this email");
            }
            user.setEmail(request.email().toLowerCase());
        }
        if (request.phone() != null && !request.phone().isBlank()) {
            user.setPhone(request.phone());
        }

        return appUserRepository.save(user);
    }

    @Transactional
    public MessageResponse forgotUserPassword(String email) {
        var userOpt = appUserRepository.findByEmailIgnoreCase(email);
        if (userOpt.isEmpty()) {
            return new MessageResponse("If that account exists, a reset link has been sent");
        }
        AppUser user = userOpt.get();
        String rawToken = generateToken();
        user.setResetPasswordToken(hash(rawToken));
        user.setResetPasswordExpires(Instant.now().plus(1, ChronoUnit.HOURS));
        appUserRepository.save(user);

        return devToken(rawToken);
    }

    @Transactional
    public MessageResponse resetUserPassword(String rawToken, String newPassword) {
        AppUser user = appUserRepository.findByResetPasswordToken(hash(rawToken))
                .filter(u -> u.getResetPasswordExpires() != null && u.getResetPasswordExpires().isAfter(Instant.now()))
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Reset token is invalid or has expired"));

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpires(null);
        appUserRepository.save(user);

        return new MessageResponse("Password updated successfully");
    }

    /* ------------------------------- helpers ------------------------------- */

    private String generateToken() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String token) {
        return org.springframework.util.DigestUtils.md5DigestAsHex(token.getBytes());
        // Note: this is only used to look up an opaque, high-entropy random
        // token (not a password), so MD5's weaknesses as a cryptographic
        // hash are not relevant here - it's just an index key. If you'd
        // rather avoid MD5 entirely, swap for SHA-256 via MessageDigest.
    }

    private MessageResponse devToken(String rawToken) {
        boolean isProd = java.util.Arrays.asList(environment.getActiveProfiles()).contains("prod");
        String message = "If that account exists, a reset link has been sent";
        return isProd ? new MessageResponse(message) : new MessageResponse(message, rawToken);
    }
}
