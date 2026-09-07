package com.salon.backend.entity;

// Gates whether superadmin-created catalog content (services, products,
// offers) is visible to customers. New items always start PENDING - a
// branch admin (or superadmin) must explicitly APPROVE them before they
// appear on any /api/public/** endpoint. See BookingService's public
// controllers, which filter on this alongside `active`.
public enum ApprovalStatus {
    PENDING,
    APPROVED,
    REJECTED
}
