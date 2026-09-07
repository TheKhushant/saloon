package com.salon.backend.repository;

import com.salon.backend.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OfferRepository extends JpaRepository<Offer, UUID> {
    Optional<Offer> findByCodeIgnoreCaseAndActiveTrue(String code);
}
