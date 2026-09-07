package com.salon.backend.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "templates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Template extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TemplateCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private TemplateStatus status = TemplateStatus.DRAFT;

    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "before_image_url")
    private String beforeImageUrl;

    @Column(name = "after_image_url")
    private String afterImageUrl;

    @Column(name = "suitable_for")
    private String suitableFor;

    @Column(name = "budget_min", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal budgetMin = BigDecimal.ZERO;

    @Column(name = "budget_max", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal budgetMax = BigDecimal.ZERO;

    @Column(name = "setup_days")
    @Builder.Default
    private Integer setupDays = 0;

    @Builder.Default
    private BigDecimal rating = BigDecimal.ZERO;

    @Builder.Default
    private String version = "1.0";

    @Column(name = "created_by")
    private String createdBy;

    @Column(nullable = false)
    @Builder.Default
    private boolean favorite = false;

    @ElementCollection
    @CollectionTable(name = "template_images", joinColumns = @JoinColumn(name = "template_id"))
    @Column(name = "image")
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "template_theme_colors", joinColumns = @JoinColumn(name = "template_id"))
    @Column(name = "color")
    @Builder.Default
    private List<String> themeColors = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "template_furniture", joinColumns = @JoinColumn(name = "template_id"))
    @Column(name = "item")
    @Builder.Default
    private List<String> furniture = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "template_tags", joinColumns = @JoinColumn(name = "template_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<TemplateCostItem> costBreakdown = new ArrayList<>();

    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<TemplateAssignment> assignments = new ArrayList<>();
}
