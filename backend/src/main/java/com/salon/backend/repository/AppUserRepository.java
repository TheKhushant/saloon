package com.salon.backend.repository;

import com.salon.backend.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AppUserRepository extends JpaRepository<AppUser, UUID> {
    Optional<AppUser> findByEmailIgnoreCase(String email);
    Optional<AppUser> findByResetPasswordToken(String resetPasswordToken);
    boolean existsByEmailIgnoreCase(String email);
}
