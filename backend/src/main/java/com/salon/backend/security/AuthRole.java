package com.salon.backend.security;

// Roles carried inside the JWT. Distinct from the entity-level AdminRole
// enum because a token can also represent a storefront customer, which has
// no corresponding "role" column anywhere.
public enum AuthRole {
    ADMIN,
    SUPERADMIN,
    CUSTOMER
}
