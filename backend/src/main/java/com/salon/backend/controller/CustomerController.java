package com.salon.backend.controller;

import com.salon.backend.dto.common.CustomerRequest;
import com.salon.backend.entity.Branch;
import com.salon.backend.entity.Customer;
import com.salon.backend.exception.ResourceNotFoundException;
import com.salon.backend.repository.BranchRepository;
import com.salon.backend.repository.CustomerRepository;
import com.salon.backend.security.BranchScope;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerRepository customerRepository;
    private final BranchRepository branchRepository;

    @GetMapping
    public List<Customer> list(@RequestParam(required = false) UUID branchId) {
        UUID effective = BranchScope.resolve(branchId);
        return effective != null ? customerRepository.findByBranchId(effective) : customerRepository.findAll();
    }

    @GetMapping("/{id}")
    public Customer get(@PathVariable UUID id) {
        return customerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Customer create(@RequestBody CustomerRequest request) {
        UUID branchId = BranchScope.resolve(request.branchId());
        Branch branch = branchId != null
                ? branchRepository.findById(branchId).orElseThrow(() -> new ResourceNotFoundException("Branch not found"))
                : null;

        Customer customer = Customer.builder()
                .name(request.name())
                .phone(request.phone())
                .email(request.email())
                .active(request.active() == null || request.active())
                .notes(request.notes())
                .branch(branch)
                .totalBookings(0)
                .totalSpent(BigDecimal.ZERO)
                .build();
        return customerRepository.save(customer);
    }

    @PatchMapping("/{id}")
    public Customer update(@PathVariable UUID id, @RequestBody CustomerRequest request) {
        Customer customer = get(id);
        if (request.name() != null) customer.setName(request.name());
        if (request.phone() != null) customer.setPhone(request.phone());
        if (request.email() != null) customer.setEmail(request.email());
        if (request.active() != null) customer.setActive(request.active());
        if (request.notes() != null) customer.setNotes(request.notes());
        return customerRepository.save(customer);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer not found");
        }
        customerRepository.deleteById(id);
    }
}
