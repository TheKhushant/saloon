package com.salon.backend.controller;

import com.salon.backend.dto.common.BarberRequest;
import com.salon.backend.entity.Barber;
import com.salon.backend.entity.Branch;
import com.salon.backend.exception.ApiException;
import com.salon.backend.exception.ResourceNotFoundException;
import com.salon.backend.repository.BarberRepository;
import com.salon.backend.repository.BranchRepository;
import com.salon.backend.security.BranchScope;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/barbers")
@RequiredArgsConstructor
public class BarberController {

    private final BarberRepository barberRepository;
    private final BranchRepository branchRepository;

    @GetMapping
    public List<Barber> list(@RequestParam(required = false) UUID branchId) {
        UUID effective = BranchScope.resolve(branchId);
        return effective != null ? barberRepository.findByBranchId(effective) : barberRepository.findAll();
    }

    @GetMapping("/{id}")
    public Barber get(@PathVariable UUID id) {
        return barberRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Barber not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Barber create(@RequestBody BarberRequest request) {
        UUID branchId = BranchScope.resolve(request.branchId());
        if (branchId == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "branchId is required");
        }
        Branch branch = branchRepository.findById(branchId).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));

        Barber barber = Barber.builder()
                .name(request.name())
                .phone(request.phone())
                .email(request.email())
                .specialties(request.specialties() != null ? new ArrayList<>(request.specialties()) : new ArrayList<>())
                .active(request.active() == null || request.active())
                .branch(branch)
                .build();
        return barberRepository.save(barber);
    }

    @PatchMapping("/{id}")
    public Barber update(@PathVariable UUID id, @RequestBody BarberRequest request) {
        Barber barber = get(id);
        if (request.name() != null) barber.setName(request.name());
        if (request.phone() != null) barber.setPhone(request.phone());
        if (request.email() != null) barber.setEmail(request.email());
        if (request.specialties() != null) barber.setSpecialties(new ArrayList<>(request.specialties()));
        if (request.active() != null) barber.setActive(request.active());
        return barberRepository.save(barber);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        if (!barberRepository.existsById(id)) {
            throw new ResourceNotFoundException("Barber not found");
        }
        barberRepository.deleteById(id);
    }
}
