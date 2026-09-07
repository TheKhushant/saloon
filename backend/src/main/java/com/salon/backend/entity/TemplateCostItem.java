// package com.salon.backend.entity;

// import jakarta.persistence.Column;
// import jakarta.persistence.Entity;
// import jakarta.persistence.FetchType;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
// import jakarta.persistence.Table;
// import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.NotNull;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Getter;
// import lombok.NoArgsConstructor;
// import lombok.Setter;

// import java.math.BigDecimal;

// @Entity
// @Table(name = "template_cost_items")
// @Getter
// @Setter
// @NoArgsConstructor
// @AllArgsConstructor
// @Builder
// public class TemplateCostItem extends BaseEntity {

//     @ManyToOne(fetch = FetchType.LAZY, optional = false)
//     @JoinColumn(name = "template_id", nullable = false)
//     private Template template;

//     @NotBlank
//     @Column(nullable = false)
//     private String label;

//     @NotNull
//     @Column(nullable = false, precision = 12, scale = 2)
//     private BigDecimal amount;
// }
package com.salon.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
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

import java.math.BigDecimal;

@Entity
@Table(name = "template_cost_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemplateCostItem extends BaseEntity {

    // See the identical note on ProductAllocation.product - breaks the
    // Template.costItems <-> template cycle.
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "template_id", nullable = false)
    private Template template;

    @NotBlank
    @Column(nullable = false)
    private String label;

    @NotNull
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;
}