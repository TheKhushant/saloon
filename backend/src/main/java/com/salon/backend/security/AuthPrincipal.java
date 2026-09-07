package com.salon.backend.security;

import java.util.UUID;

// The decoded, trusted contents of a JWT. Set as the Spring Security
// principal for every authenticated request - no DB lookup needed per
// request, keeping auth fully stateless.
public record AuthPrincipal(UUID id, AuthRole role, UUID branchId) {

    public boolean isSuperadmin() {
        return role == AuthRole.SUPERADMIN;
    }

    public boolean isBranchAdmin() {
        return role == AuthRole.ADMIN && branchId != null;
    }
}
