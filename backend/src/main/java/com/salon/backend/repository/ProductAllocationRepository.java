package com.salon.backend.repository;

import com.salon.backend.entity.ProductAllocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProductAllocationRepository extends JpaRepository<ProductAllocation, UUID> {
}
