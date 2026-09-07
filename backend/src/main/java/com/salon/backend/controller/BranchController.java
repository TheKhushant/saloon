package com.salon.backend.controller;

import com.salon.backend.dto.common.BranchRequest;
import com.salon.backend.entity.Branch;
import com.salon.backend.exception.ResourceNotFoundException;
import com.salon.backend.repository.BranchRepository;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/branches")
@RequiredArgsConstructor
public class BranchController {

    private final BranchRepository branchRepository;

    @GetMapping
    public List<Branch> list() {
        return branchRepository.findAll();
    }

    @GetMapping("/{id}")
    public Branch get(@PathVariable UUID id) {
        return branchRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPERADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public Branch create(@RequestBody BranchRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            throw new com.salon.backend.exception.ApiException(HttpStatus.BAD_REQUEST, "name is required");
        }
        Branch branch = Branch.builder()
                .name(request.name())
                .address(request.address())
                .phone(request.phone())
                .active(request.active() == null || request.active())
                .build();
        return branchRepository.save(branch);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public Branch update(@PathVariable UUID id, @RequestBody BranchRequest request) {
        Branch branch = get(id);
        if (request.name() != null) branch.setName(request.name());
        if (request.address() != null) branch.setAddress(request.address());
        if (request.phone() != null) branch.setPhone(request.phone());
        if (request.active() != null) branch.setActive(request.active());
        return branchRepository.save(branch);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public void delete(@PathVariable UUID id) {
        if (!branchRepository.existsById(id)) {
            throw new ResourceNotFoundException("Branch not found");
        }
        branchRepository.deleteById(id);
    }
}
