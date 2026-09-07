package com.salon.backend.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
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

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "barbers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Barber extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String phone;

    private String email;

    @ElementCollection
    @CollectionTable(name = "barber_specialties", joinColumns = @JoinColumn(name = "barber_id"))
    @Column(name = "specialty")
    @Builder.Default
    private List<String> specialties = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    // Read-only shadow of the same branch_id column, mapped as a plain
    // value (not an association) so reading it NEVER touches the lazy
    // `branch` proxy above - safe to serialize even with the Hibernate
    // session already closed (open-in-view: false). Use this whenever you
    // just need the id; use `branch` only inside an active transaction.
    @Column(name = "branch_id", insertable = false, updatable = false)
    private java.util.UUID branchId;
}
