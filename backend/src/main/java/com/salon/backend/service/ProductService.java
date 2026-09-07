package com.salon.backend.service;

import com.salon.backend.entity.*;
import com.salon.backend.exception.ResourceNotFoundException;
import com.salon.backend.repository.BranchRepository;
import com.salon.backend.repository.ProductRepository;
import com.salon.backend.repository.StockRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final BranchRepository branchRepository;
    private final StockRequestRepository stockRequestRepository;

    public Product findById(UUID id) {
        return productRepository.findByIdWithAllocations(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    @Transactional
    public Product addAllocation(UUID productId, UUID branchId, Integer quantity, LocalDate assignedDate, AllocationStatus status) {
        Product product = findById(productId);
        Branch branch = branchRepository.findById(branchId).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));

        ProductAllocation allocation = ProductAllocation.builder()
                .product(product)
                .branch(branch)
                .quantity(quantity)
                .assignedDate(assignedDate)
                .status(status != null ? status : AllocationStatus.PENDING)
                .build();

        product.getAllocations().add(allocation);
        return productRepository.save(product);
    }

    @Transactional
    public Product updateAllocation(UUID productId, UUID allocationId, Integer quantity, AllocationStatus status) {
        Product product = findById(productId);
        ProductAllocation allocation = product.getAllocations().stream()
                .filter(a -> a.getId().equals(allocationId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Allocation not found"));

        if (quantity != null) allocation.setQuantity(quantity);
        if (status != null) allocation.setStatus(status);

        return productRepository.save(product);
    }

    @Transactional
    public Product removeAllocation(UUID productId, UUID allocationId) {
        Product product = findById(productId);
        boolean removed = product.getAllocations().removeIf(a -> a.getId().equals(allocationId));
        if (!removed) {
            throw new ResourceNotFoundException("Allocation not found");
        }
        return productRepository.save(product);
    }

    /* ---------------------------- Stock requests ---------------------------- */

    @Transactional
    public StockRequest createStockRequest(UUID productId, UUID branchId) {
        Product product = findById(productId);
        Branch branch = branchRepository.findById(branchId).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));

        StockRequest request = StockRequest.builder()
                .product(product)
                .branch(branch)
                .status(StockRequestStatus.PENDING)
                .build();

        return stockRequestRepository.save(request);
    }

    public List<StockRequest> listStockRequests(StockRequestStatus status, UUID branchId) {
        if (status != null) return stockRequestRepository.findByStatus(status);
        if (branchId != null) return stockRequestRepository.findByBranchId(branchId);
        return stockRequestRepository.findAll();
    }

    @Transactional
    public StockRequest updateStockRequestStatus(UUID id, StockRequestStatus status) {
        StockRequest request = stockRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock request not found"));
        request.setStatus(status);
        return stockRequestRepository.save(request);
    }
}
