package com.salon.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "product_allocations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductAllocation extends BaseEntity {

    // @JsonIgnore breaks the Product <-> ProductAllocation serialization
    // cycle: Product.allocations lists these, and each allocation points
    // back to its Product. Without this, any endpoint that eagerly fetches
    // allocations (e.g. ProductRepository.findAllWithAllocations(), used by
    // the admin/superadmin product list) recurses forever
    // (Product -> allocations -> product -> allocations -> ...) and blows
    // the stack with a StackOverflowError, taking the whole response down.
    // Endpoints that leave `allocations` an untouched lazy proxy (e.g. the
    // public product list) never hit this because Hibernate6Module quietly
    // serializes uninitialized proxies as empty - so the bug only shows up
    // once the collection is actually populated. ProductAllocation is only
    // ever serialized nested under Product.allocations, so nothing needs
    // `product` in the JSON output.
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    // Flat, safe-to-serialize shadow of branch_id - see the identical field
    // on Barber for why (avoids LazyInitializationException on the `branch`
    // proxy once the Hibernate session has closed).
    @Column(name = "branch_id", insertable = false, updatable = false)
    private java.util.UUID branchId;

    @NotNull
    @Column(nullable = false)
    private Integer quantity;

    @NotNull
    @Column(name = "assigned_date", nullable = false)
    private LocalDate assignedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AllocationStatus status = AllocationStatus.PENDING;
}