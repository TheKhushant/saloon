package com.salon.backend.controller;

import com.salon.backend.dto.common.AssignmentRequest;
import com.salon.backend.dto.common.TemplateRequest;
import com.salon.backend.entity.*;
import com.salon.backend.exception.ApiException;
import com.salon.backend.exception.ResourceNotFoundException;
import com.salon.backend.repository.TemplateRepository;
import com.salon.backend.service.TemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/templates")
@RequiredArgsConstructor
public class TemplateController {

    private final TemplateRepository templateRepository;
    private final TemplateService templateService;

    @GetMapping
    public List<Template> list(@RequestParam(required = false) String category,
                                @RequestParam(required = false) String status) {
        return templateService.findAll().stream()
                .filter(t -> category == null || t.getCategory().name().equalsIgnoreCase(category))
                .filter(t -> status == null || t.getStatus().name().equalsIgnoreCase(status))
                .toList();
    }

    @GetMapping("/{id}")
    public Template get(@PathVariable UUID id) {
        return templateService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Template create(@RequestBody TemplateRequest request) {
        Template template = Template.builder()
                .name(request.name())
                .category(parseCategory(request.category()))
                .status(request.status() != null ? parseStatus(request.status()) : TemplateStatus.DRAFT)
                .description(request.description())
                .imageUrl(request.imageUrl())
                .beforeImageUrl(request.beforeImageUrl())
                .afterImageUrl(request.afterImageUrl())
                .suitableFor(request.suitableFor() != null ? request.suitableFor() : "")
                .budgetMin(request.budgetMin() != null ? request.budgetMin() : BigDecimal.ZERO)
                .budgetMax(request.budgetMax() != null ? request.budgetMax() : BigDecimal.ZERO)
                .setupDays(request.setupDays() != null ? request.setupDays() : 0)
                .rating(request.rating() != null ? request.rating() : BigDecimal.ZERO)
                .version(request.version() != null ? request.version() : "1.0")
                .createdBy(request.createdBy())
                .favorite(false)
                .images(request.images() != null ? new ArrayList<>(request.images()) : new ArrayList<>())
                .themeColors(request.themeColors() != null ? new ArrayList<>(request.themeColors()) : new ArrayList<>())
                .furniture(request.furniture() != null ? new ArrayList<>(request.furniture()) : new ArrayList<>())
                .tags(request.tags() != null ? new ArrayList<>(request.tags()) : new ArrayList<>())
                .costBreakdown(new ArrayList<>())
                .assignments(new ArrayList<>())
                .build();

        Template saved = templateRepository.save(template);

        if (request.costBreakdown() != null) {
            for (var item : request.costBreakdown()) {
                saved.getCostBreakdown().add(TemplateCostItem.builder()
                        .template(saved).label(item.label()).amount(item.amount()).build());
            }
            saved = templateRepository.save(saved);
        }
        return saved;
    }

    @PatchMapping("/{id}")
    public Template update(@PathVariable UUID id, @RequestBody TemplateRequest request) {
        Template template = templateService.findById(id);
        if (request.name() != null) template.setName(request.name());
        if (request.category() != null) template.setCategory(parseCategory(request.category()));
        if (request.status() != null) template.setStatus(parseStatus(request.status()));
        if (request.description() != null) template.setDescription(request.description());
        if (request.imageUrl() != null) template.setImageUrl(request.imageUrl());
        if (request.beforeImageUrl() != null) template.setBeforeImageUrl(request.beforeImageUrl());
        if (request.afterImageUrl() != null) template.setAfterImageUrl(request.afterImageUrl());
        if (request.suitableFor() != null) template.setSuitableFor(request.suitableFor());
        if (request.budgetMin() != null) template.setBudgetMin(request.budgetMin());
        if (request.budgetMax() != null) template.setBudgetMax(request.budgetMax());
        if (request.setupDays() != null) template.setSetupDays(request.setupDays());
        if (request.rating() != null) template.setRating(request.rating());
        if (request.version() != null) template.setVersion(request.version());
        if (request.images() != null) template.setImages(new ArrayList<>(request.images()));
        if (request.themeColors() != null) template.setThemeColors(new ArrayList<>(request.themeColors()));
        if (request.furniture() != null) template.setFurniture(new ArrayList<>(request.furniture()));
        if (request.tags() != null) template.setTags(new ArrayList<>(request.tags()));
        return templateRepository.save(template);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        if (!templateRepository.existsById(id)) {
            throw new ResourceNotFoundException("Template not found");
        }
        templateRepository.deleteById(id);
    }

    @PostMapping("/{id}/duplicate")
    @ResponseStatus(HttpStatus.CREATED)
    public Template duplicate(@PathVariable UUID id) {
        return templateService.duplicate(id);
    }

    @PatchMapping("/{id}/favorite")
    public Template toggleFavorite(@PathVariable UUID id) {
        return templateService.toggleFavorite(id);
    }

    /* ------------------------------- Assignments ------------------------------- */

    @PostMapping("/{id}/assignments")
    @ResponseStatus(HttpStatus.CREATED)
    public Template addAssignment(@PathVariable UUID id, @RequestBody AssignmentRequest request) {
        return templateService.addAssignment(id, request.branchId(), request.assignedDate(), parseAllocationStatus(request.status()));
    }

    @PatchMapping("/{id}/assignments/{assignmentId}")
    public Template updateAssignment(@PathVariable UUID id, @PathVariable UUID assignmentId, @RequestBody AssignmentRequest request) {
        return templateService.updateAssignment(id, assignmentId, request.assignedDate(), parseAllocationStatus(request.status()));
    }

    @DeleteMapping("/{id}/assignments/{assignmentId}")
    public Template removeAssignment(@PathVariable UUID id, @PathVariable UUID assignmentId) {
        return templateService.removeAssignment(id, assignmentId);
    }

    /* --------------------------------- helpers --------------------------------- */

    private TemplateCategory parseCategory(String value) {
        try {
            return TemplateCategory.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid category: " + value);
        }
    }

    private TemplateStatus parseStatus(String value) {
        try {
            return TemplateStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid status: " + value);
        }
    }

    private AllocationStatus parseAllocationStatus(String value) {
        if (value == null) return null;
        try {
            return AllocationStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid status: " + value);
        }
    }
}