package com.salon.backend.security;

import java.util.UUID;

// Resolves the effective branch filter for a request: a branch-scoped admin
// is always forced to their own branch (the query param, if any, is
// ignored); a superadmin may pass any branchId (or none, for "all").
public final class BranchScope {

    private BranchScope() {
    }

    public static UUID resolve(UUID requestedBranchId) {
        AuthPrincipal principal = AuthContext.current();
        if (principal.isBranchAdmin()) {
            return principal.branchId();
        }
        return requestedBranchId;
    }
}
