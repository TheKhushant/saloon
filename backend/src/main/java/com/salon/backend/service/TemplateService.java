package com.salon.backend.service;

import com.salon.backend.entity.*;
import com.salon.backend.exception.ResourceNotFoundException;
import com.salon.backend.repository.BranchRepository;
import com.salon.backend.repository.TemplateRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TemplateService {

    private final TemplateRepository templateRepository;
    private final BranchRepository branchRepository;

    // costBreakdown/assignments are @OneToMany(fetch = LAZY). With
    // open-in-view disabled and no transaction open at serialization time,
    // Jackson's Hibernate6Module (FORCE_LAZY_LOADING off, see JacksonConfig)
    // writes an uninitialized lazy collection out as null rather than [] -
    // which crashes any frontend code that calls .reduce()/.map() on it
    // (e.g. getEstimatedCost). Initialize both explicitly, inside a
    // transaction, before the entity leaves this layer.
    private Template hydrate(Template template) {
        Hibernate.initialize(template.getCostBreakdown());
        Hibernate.initialize(template.getAssignments());
        return template;
    }

    @Transactional(readOnly = true)
    public List<Template> findAll() {
        List<Template> templates = templateRepository.findAll();
        templates.forEach(this::hydrate);
        return templates;
    }

    @Transactional(readOnly = true)
    public Template findById(UUID id) {
        Template template = templateRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Template not found"));
        return hydrate(template);
    }

    @Transactional
    public Template duplicate(UUID id) {
        Template original = findById(id);

        Template copy = Template.builder()
                .name(original.getName() + " (Copy)")
                .category(original.getCategory())
                .status(TemplateStatus.DRAFT)
                .description(original.getDescription())
                .imageUrl(original.getImageUrl())
                .beforeImageUrl(original.getBeforeImageUrl())
                .afterImageUrl(original.getAfterImageUrl())
                .suitableFor(original.getSuitableFor())
                .budgetMin(original.getBudgetMin())
                .budgetMax(original.getBudgetMax())
                .setupDays(original.getSetupDays())
                .rating(original.getRating())
                .version(original.getVersion())
                .createdBy(original.getCreatedBy())
                .favorite(false)
                .images(new ArrayList<>(original.getImages()))
                .themeColors(new ArrayList<>(original.getThemeColors()))
                .furniture(new ArrayList<>(original.getFurniture()))
                .tags(new ArrayList<>(original.getTags()))
                .costBreakdown(new ArrayList<>())
                .assignments(new ArrayList<>())
                .build();

        Template saved = templateRepository.save(copy);

        // Cost items copied separately since they need the new parent reference.
        for (TemplateCostItem item : original.getCostBreakdown()) {
            saved.getCostBreakdown().add(TemplateCostItem.builder()
                    .template(saved)
                    .label(item.getLabel())
                    .amount(item.getAmount())
                    .build());
        }

        return templateRepository.save(saved);
    }

    @Transactional
    public Template toggleFavorite(UUID id) {
        Template template = findById(id);
        template.setFavorite(!template.isFavorite());
        return templateRepository.save(template);
    }

    @Transactional
    public Template addAssignment(UUID templateId, UUID branchId, LocalDate assignedDate, AllocationStatus status) {
        Template template = findById(templateId);
        Branch branch = branchRepository.findById(branchId).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));

        TemplateAssignment assignment = TemplateAssignment.builder()
                .template(template)
                .branch(branch)
                .assignedDate(assignedDate)
                .status(status != null ? status : AllocationStatus.PENDING)
                .build();

        template.getAssignments().add(assignment);
        return templateRepository.save(template);
    }

    @Transactional
    public Template updateAssignment(UUID templateId, UUID assignmentId, LocalDate assignedDate, AllocationStatus status) {
        Template template = findById(templateId);
        TemplateAssignment assignment = template.getAssignments().stream()
                .filter(a -> a.getId().equals(assignmentId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        if (assignedDate != null) assignment.setAssignedDate(assignedDate);
        if (status != null) assignment.setStatus(status);

        return templateRepository.save(template);
    }

    @Transactional
    public Template removeAssignment(UUID templateId, UUID assignmentId) {
        Template template = findById(templateId);
        boolean removed = template.getAssignments().removeIf(a -> a.getId().equals(assignmentId));
        if (!removed) {
            throw new ResourceNotFoundException("Assignment not found");
        }
        return templateRepository.save(template);
    }
}