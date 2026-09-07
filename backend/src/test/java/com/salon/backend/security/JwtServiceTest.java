package com.salon.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

// A self-contained unit test (no Spring context, no DB) that exercises the
// core JWT issue/parse round trip and failure modes. Run with `mvn test`.
class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secret", "a".repeat(48));
        ReflectionTestUtils.setField(jwtService, "expirationMs", 60_000L);
        ReflectionTestUtils.invokeMethod(jwtService, "init");
    }

    @Test
    void issuesAndParsesAValidToken() {
        UUID id = UUID.randomUUID();
        UUID branchId = UUID.randomUUID();

        String token = jwtService.issue(id, AuthRole.ADMIN, branchId);
        AuthPrincipal principal = jwtService.parse(token);

        assertNotNull(principal);
        assertEquals(id, principal.id());
        assertEquals(AuthRole.ADMIN, principal.role());
        assertEquals(branchId, principal.branchId());
    }

    @Test
    void tokenWithoutBranchIdParsesWithNullBranch() {
        UUID id = UUID.randomUUID();
        String token = jwtService.issue(id, AuthRole.CUSTOMER, null);

        AuthPrincipal principal = jwtService.parse(token);

        assertNotNull(principal);
        assertNull(principal.branchId());
        assertEquals(AuthRole.CUSTOMER, principal.role());
    }

    @Test
    void garbageTokenReturnsNullInsteadOfThrowing() {
        assertNull(jwtService.parse("not-a-real-token"));
    }

    @Test
    void tokenSignedWithDifferentSecretIsRejected() {
        String token = jwtService.issue(UUID.randomUUID(), AuthRole.SUPERADMIN, null);

        JwtService otherService = new JwtService();
        ReflectionTestUtils.setField(otherService, "secret", "b".repeat(48));
        ReflectionTestUtils.setField(otherService, "expirationMs", 60_000L);
        ReflectionTestUtils.invokeMethod(otherService, "init");

        assertNull(otherService.parse(token));
    }

    @Test
    void rejectsSecretShorterThan32Bytes() {
        JwtService weak = new JwtService();
        ReflectionTestUtils.setField(weak, "secret", "too-short");
        ReflectionTestUtils.setField(weak, "expirationMs", 60_000L);

        assertThrows(IllegalStateException.class,
                () -> ReflectionTestUtils.invokeMethod(weak, "init"));
    }
}
