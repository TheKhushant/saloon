package com.salon.backend.config;

import com.salon.backend.entity.Admin;
import com.salon.backend.entity.AdminRole;
import com.salon.backend.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Creates exactly ONE thing on first boot: the initial superadmin account,
 * so there's a way to log in and start creating real data. Nothing else -
 * no sample branches, barbers, services, products, or offers. The app is
 * meant to be populated entirely with real data from here on.
 *
 * Controlled by app.seed.enabled (true in the dev profile, false in prod -
 * see application-prod.yml). In production, create the first superadmin
 * manually instead (direct SQL insert with a bcrypt hash, or temporarily
 * flip app.seed.enabled on for one boot then back off).
 *
 * Safe to leave on: it only acts when there are zero admin accounts at all,
 * so it never overwrites or duplicates a real superadmin you've since created.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SuperadminBootstrap implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled}")
    private boolean seedEnabled;

    @Value("${app.seed.superadmin-email}")
    private String superadminEmail;

    @Value("${app.seed.superadmin-password}")
    private String superadminPassword;

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedEnabled) return;
        if (adminRepository.count() > 0) {
            log.info("Superadmin bootstrap skipped - an admin account already exists.");
            return;
        }

        adminRepository.save(Admin.builder()
                .name("Super Admin")
                .email(superadminEmail.toLowerCase())
                .password(passwordEncoder.encode(superadminPassword))
                .role(AdminRole.SUPERADMIN)
                .active(true)
                .build());

        log.info("Bootstrapped initial superadmin account: {}", superadminEmail);
        log.info("Log in and change this password immediately, then create real branches, " +
                "barbers, services, products, and offers through the app - no sample data is seeded.");
    }
}
