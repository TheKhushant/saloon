package com.salon.backend.controller;

import com.salon.backend.dto.common.SalonServiceRequest;
import com.salon.backend.entity.Branch;
import com.salon.backend.entity.SalonService;
import com.salon.backend.exception.ResourceNotFoundException;
import com.salon.backend.repository.BranchRepository;
import com.salon.backend.repository.SalonServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/services")
@RequiredArgsConstructor
public class SalonServiceController {

    private final SalonServiceRepository serviceRepository;
    private final BranchRepository branchRepository;

    @GetMapping
    public List<SalonService> list(@RequestParam(required = false) Boolean active,
                                    @RequestParam(required = false) String approvalStatus) {
        List<SalonService> results = Boolean.TRUE.equals(active) ? serviceRepository.findByActiveTrue() : serviceRepository.findAll();
        if (approvalStatus != null) {
            var status = com.salon.backend.entity.ApprovalStatus.valueOf(approvalStatus.toUpperCase());
            results = results.stream().filter(s -> s.getApprovalStatus() == status).toList();
        }
        return results;
    }

    @GetMapping("/{id}")
    public SalonService get(@PathVariable UUID id) {
        return serviceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Service not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SalonService create(@RequestBody SalonServiceRequest request) {
        Branch branch = request.branchId() != null
                ? branchRepository.findById(request.branchId()).orElseThrow(() -> new ResourceNotFoundException("Branch not found"))
                : null;

        // Same approval rule as Product/Offer: a superadmin-created service
        // is auto-approved and immediately live; a branch-admin-created one
        // starts PENDING and needs superadmin approval before it's visible
        // on the public site.
        boolean isSuperadmin = com.salon.backend.security.AuthContext.current().isSuperadmin();

        SalonService service = SalonService.builder()
                .name(request.name())
                .category(request.category())
                .durationMinutes(request.durationMinutes())
                .price(request.price())
                .active(request.active() == null || request.active())
                .approvalStatus(isSuperadmin
                        ? com.salon.backend.entity.ApprovalStatus.APPROVED
                        : com.salon.backend.entity.ApprovalStatus.PENDING)
                .description(request.description())
                .branch(branch)
                .image(request.image())
                .rating(request.rating() != null ? request.rating() : BigDecimal.ZERO)
                .stylists(request.stylists() != null ? request.stylists() : 0)
                .popularity(request.popularity() != null ? request.popularity() : 0)
                .originalPrice(request.originalPrice())
                .tags(request.tags() != null ? new ArrayList<>(request.tags()) : new ArrayList<>())
                .benefits(request.benefits() != null ? new ArrayList<>(request.benefits()) : new ArrayList<>())
                .build();

        return serviceRepository.save(service);
    }

    @PatchMapping("/{id}")
    public SalonService update(@PathVariable UUID id, @RequestBody SalonServiceRequest request) {
        SalonService service = get(id);
        if (request.name() != null) service.setName(request.name());
        if (request.category() != null) service.setCategory(request.category());
        if (request.durationMinutes() != null) service.setDurationMinutes(request.durationMinutes());
        if (request.price() != null) service.setPrice(request.price());
        if (request.active() != null) service.setActive(request.active());
        if (request.description() != null) service.setDescription(request.description());
        if (request.branchId() != null) {
            service.setBranch(branchRepository.findById(request.branchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found")));
        }
        if (request.image() != null) service.setImage(request.image());
        if (request.rating() != null) service.setRating(request.rating());
        if (request.stylists() != null) service.setStylists(request.stylists());
        if (request.popularity() != null) service.setPopularity(request.popularity());
        if (request.originalPrice() != null) service.setOriginalPrice(request.originalPrice());
        if (request.tags() != null) service.setTags(new ArrayList<>(request.tags()));
        if (request.benefits() != null) service.setBenefits(new ArrayList<>(request.benefits()));
        return serviceRepository.save(service);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        if (!serviceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Service not found");
        }
        serviceRepository.deleteById(id);
    }

    /**
     * A branch admin (or superadmin) reviewing content in the admin
     * dashboard "allows" it here - only after this does it become eligible
     * to appear on /api/public/services (still also gated by `active`).
     */
    @PatchMapping("/{id}/approve")
    public SalonService approve(@PathVariable UUID id) {
        SalonService service = get(id);
        service.setApprovalStatus(com.salon.backend.entity.ApprovalStatus.APPROVED);
        return serviceRepository.save(service);
    }

    @PatchMapping("/{id}/reject")
    public SalonService reject(@PathVariable UUID id) {
        SalonService service = get(id);
        service.setApprovalStatus(com.salon.backend.entity.ApprovalStatus.REJECTED);
        return serviceRepository.save(service);
    }
}
