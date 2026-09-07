package com.salon.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking extends BaseEntity {

    // Human-friendly reference, e.g. BK-000123. Assigned in the service
    // layer before save (see BookingService).
    @Column(name = "booking_ref", nullable = false, unique = true)
    private String bookingRef;

    @NotBlank
    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @NotBlank
    @Column(name = "customer_phone", nullable = false)
    private String customerPhone;

    @Column(name = "customer_email")
    private String customerEmail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    // Denormalized display name, kept in sync with `service` at creation
    // time so historical bookings still show a name if the service is later
    // renamed or deleted.
    @NotBlank
    @Column(nullable = false)
    private String service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private SalonService salonService;

    // Read-only shadow of the same service_id column, mapped as a plain
    // value (not an association) so reading it never touches the lazy
    // `salonService` proxy above - safe to serialize even with the
    // Hibernate session already closed (open-in-view: false). Same pattern
    // as Barber.branchId/Customer.branchId.
    @Column(name = "service_id", insertable = false, updatable = false)
    private java.util.UUID serviceId;

    private String barber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barber_id")
    private Barber barberRef;

    // Read-only shadow of the same barber_id column - see serviceId above.
    @Column(name = "barber_id", insertable = false, updatable = false)
    private java.util.UUID barberId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    // Read-only shadow of the same branch_id column - see serviceId above.
    @Column(name = "branch_id", insertable = false, updatable = false)
    private java.util.UUID branchId;

    // Denormalized at creation time, same as `service`/`barber` above -
    // lets the frontend show a branch name without touching the lazy
    // `branch` proxy (unsafe once the Hibernate session has closed, see
    // JacksonConfig).
    @Column(name = "branch_name")
    private String branchName;

    @NotNull
    @Column(nullable = false)
    private LocalDate date;

    @NotBlank
    @Column(nullable = false, length = 5)
    private String time;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal total = BigDecimal.ZERO;

    // Set at creation time from Settings.requireDepositForBooking /
    // depositPercentage - a snapshot, not a live reference, so changing the
    // salon-wide setting later doesn't retroactively alter what an existing
    // booking already required. See BookingService.applyDepositIfRequired.
    @Column(name = "deposit_required", nullable = false)
    @Builder.Default
    private boolean depositRequired = false;

    @Column(name = "deposit_amount", precision = 10, scale = 2)
    private BigDecimal depositAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    private String notes;
}
