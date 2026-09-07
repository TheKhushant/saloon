package com.salon.backend.repository;

import com.salon.backend.entity.StockRequest;
import com.salon.backend.entity.StockRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StockRequestRepository extends JpaRepository<StockRequest, UUID> {
    List<StockRequest> findByStatus(StockRequestStatus status);
    List<StockRequest> findByBranchId(UUID branchId);
}
