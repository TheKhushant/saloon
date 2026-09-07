// package com.salon.backend.entity;

// import jakarta.persistence.Column;
// import jakarta.persistence.Entity;
// import jakarta.persistence.EnumType;
// import jakarta.persistence.Enumerated;
// import jakarta.persistence.FetchType;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
// import jakarta.persistence.Table;
// import jakarta.validation.constraints.NotNull;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Getter;
// import lombok.NoArgsConstructor;
// import lombok.Setter;

// import java.time.LocalDate;

// @Entity
// @Table(name = "template_assignments")
// @Getter
// @Setter
// @NoArgsConstructor
// @AllArgsConstructor
// @Builder
// public class TemplateAssignment extends BaseEntity {

//     @ManyToOne(fetch = FetchType.LAZY, optional = false)
//     @JoinColumn(name = "template_id", nullable = false)
//     private Template template;

//     @NotNull
//     @ManyToOne(fetch = FetchType.LAZY, optional = false)
//     @JoinColumn(name = "branch_id", nullable = false)
//     private Branch branch;

//     @NotNull
//     @Column(name = "assigned_date", nullable = false)
//     private LocalDate assignedDate;

//     @Enumerated(EnumType.STRING)
//     @Column(nullable = false, length = 20)
//     @Builder.Default
//     private AllocationStatus status = AllocationStatus.PENDING;
// }
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
@Table(name = "template_assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemplateAssignment extends BaseEntity {

    // See the identical note on ProductAllocation.product: without
    // @JsonIgnore this back-reference cycles with Template.assignments
    // (Template -> assignments -> template -> assignments -> ...) and
    // blows the stack as soon as the collection is initialized (which
    // TemplateService does in findById/addAssignment/updateAssignment/
    // removeAssignment before returning the Template entity).
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "template_id", nullable = false)
    private Template template;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @NotNull
    @Column(name = "assigned_date", nullable = false)
    private LocalDate assignedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AllocationStatus status = AllocationStatus.PENDING;
}