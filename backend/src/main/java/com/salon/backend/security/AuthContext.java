package com.salon.backend.security;

import com.salon.backend.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;

// Small static helper so controllers/services don't need to inject
// SecurityContextHolder plumbing directly to read the current JWT principal.
public final class AuthContext {

    private AuthContext() {
    }

    public static AuthPrincipal currentOrNull() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AuthPrincipal principal)) {
            return null;
        }
        return principal;
    }

    public static AuthPrincipal current() {
        AuthPrincipal principal = currentOrNull();
        if (principal == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        return principal;
    }
}
