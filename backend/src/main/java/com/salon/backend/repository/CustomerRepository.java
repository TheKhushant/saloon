package com.salon.backend.repository;

import com.salon.backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {
    List<Customer> findByBranchId(UUID branchId);
    Optional<Customer> findByPhone(String phone);
}
