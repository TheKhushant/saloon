package com.salon.backend.repository;

import com.salon.backend.entity.Barber;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BarberRepository extends JpaRepository<Barber, UUID> {
    List<Barber> findByBranchId(UUID branchId);
}
