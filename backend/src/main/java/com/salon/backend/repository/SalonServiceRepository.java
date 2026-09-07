package com.salon.backend.repository;

import com.salon.backend.entity.SalonService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SalonServiceRepository extends JpaRepository<SalonService, UUID> {
    List<SalonService> findByActiveTrue();
    List<SalonService> findByActiveTrueAndCategory(String category);
}
