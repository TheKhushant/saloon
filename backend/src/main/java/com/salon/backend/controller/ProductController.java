package com.salon.backend.controller;

import com.salon.backend.dto.common.AllocationRequest;
import com.salon.backend.dto.common.ProductRequest;
import com.salon.backend.dto.common.StockRequestRequest;
import com.salon.backend.dto.common.StockRequestStatusUpdate;
import com.salon.backend.entity.*;
import com.salon.backend.exception.ApiException;
import com.salon.backend.exception.ResourceNotFoundException;
import com.salon.backend.repository.ProductRepository;
import com.salon.backend.repository.StockRequestRepository;
import com.salon.backend.security.AuthContext;
import com.salon.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final ProductService productService;
    private final StockRequestRepository stockRequestRepository;

    /* -------------------------------- Products -------------------------------- */

    @GetMapping("/products")
    public List<Product> list(@RequestParam(required = false) String category,
                               @RequestParam(required = false) Boolean active,
                               @RequestParam(required = false) String approvalStatus) {
        return productRepository.findAllWithAllocations().stream()
                .filter(p -> category == null || p.getCategory().name().equalsIgnoreCase(category))
                .filter(p -> active == null || p.isActive() == active)
                .filter(p -> approvalStatus == null || p.getApprovalStatus() == parseApprovalStatus(approvalStatus))
                .toList();
    }

    @GetMapping("/products/{id}")
    public Product get(@PathVariable UUID id) {
        return productService.findById(id);
    }

    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(@RequestBody ProductRequest request) {
        // Superadmin sits at the top of the approval chain - there's no one
        // above them to approve their products, so a product they add is
        // auto-approved and immediately visible to admins and on the public
        // storefront. Products added by a branch admin still default to
        // PENDING and need superadmin approval before going live.
        boolean isSuperadmin = AuthContext.current().isSuperadmin();
        Product product = Product.builder()
                .name(request.name())
                .category(parseCategory(request.category()))
                .price(request.price())
                .totalStock(request.totalStock() != null ? request.totalStock() : 0)
                .comingSoon(Boolean.TRUE.equals(request.comingSoon()))
                .active(request.active() == null || request.active())
                .approvalStatus(isSuperadmin ? ApprovalStatus.APPROVED : ApprovalStatus.PENDING)
                .description(request.description())
                .imageUrl(request.imageUrl())
                .rating(request.rating() != null ? request.rating() : BigDecimal.ZERO)
                .reviewCount(request.reviewCount() != null ? request.reviewCount() : 0)
                .tag(request.tag())
                .howToUse(request.howToUse())
                .benefits(request.benefits() != null ? new ArrayList<>(request.benefits()) : new ArrayList<>())
                .ingredients(request.ingredients() != null ? new ArrayList<>(request.ingredients()) : new ArrayList<>())
                .allocations(new ArrayList<>())
                .build();
        return productRepository.save(product);
    }

    @PatchMapping("/products/{id}")
    public Product update(@PathVariable UUID id, @RequestBody ProductRequest request) {
        Product product = productService.findById(id);
        if (request.name() != null) product.setName(request.name());
        if (request.category() != null) product.setCategory(parseCategory(request.category()));
        if (request.price() != null) product.setPrice(request.price());
        if (request.totalStock() != null) product.setTotalStock(request.totalStock());
        if (request.comingSoon() != null) product.setComingSoon(request.comingSoon());
        if (request.active() != null) product.setActive(request.active());
        if (request.description() != null) product.setDescription(request.description());
        if (request.imageUrl() != null) product.setImageUrl(request.imageUrl());
        if (request.rating() != null) product.setRating(request.rating());
        if (request.reviewCount() != null) product.setReviewCount(request.reviewCount());
        if (request.tag() != null) product.setTag(request.tag());
        if (request.howToUse() != null) product.setHowToUse(request.howToUse());
        if (request.benefits() != null) product.setBenefits(new ArrayList<>(request.benefits()));
        if (request.ingredients() != null) product.setIngredients(new ArrayList<>(request.ingredients()));
        return productRepository.save(product);
    }

    @DeleteMapping("/products/{id}")
    public void delete(@PathVariable UUID id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }

    @PatchMapping("/products/{id}/approve")
    public Product approve(@PathVariable UUID id) {
        Product product = productService.findById(id);
        product.setApprovalStatus(ApprovalStatus.APPROVED);
        return productRepository.save(product);
    }

    @PatchMapping("/products/{id}/reject")
    public Product reject(@PathVariable UUID id) {
        Product product = productService.findById(id);
        product.setApprovalStatus(ApprovalStatus.REJECTED);
        return productRepository.save(product);
    }

    /* ------------------------------ Allocations ------------------------------ */

    @PostMapping("/products/{id}/allocations")
    @ResponseStatus(HttpStatus.CREATED)
    public Product addAllocation(@PathVariable UUID id, @RequestBody AllocationRequest request) {
        return productService.addAllocation(id, request.branchId(), request.quantity(),
                request.assignedDate(), parseAllocationStatus(request.status()));
    }

    @PatchMapping("/products/{id}/allocations/{allocationId}")
    public Product updateAllocation(@PathVariable UUID id, @PathVariable UUID allocationId, @RequestBody AllocationRequest request) {
        return productService.updateAllocation(id, allocationId, request.quantity(), parseAllocationStatus(request.status()));
    }

    @DeleteMapping("/products/{id}/allocations/{allocationId}")
    public Product removeAllocation(@PathVariable UUID id, @PathVariable UUID allocationId) {
        return productService.removeAllocation(id, allocationId);
    }

    /* ----------------------------- Stock requests ----------------------------- */

    @GetMapping("/stock-requests")
    public List<StockRequest> listStockRequests(@RequestParam(required = false) String status,
                                                 @RequestParam(required = false) UUID branchId) {
        return productService.listStockRequests(status != null ? parseStockRequestStatus(status) : null, branchId);
    }

    @PostMapping("/stock-requests")
    @ResponseStatus(HttpStatus.CREATED)
    public StockRequest createStockRequest(@RequestBody StockRequestRequest request) {
        return productService.createStockRequest(request.productId(), request.branchId());
    }

    @PatchMapping("/stock-requests/{id}")
    public StockRequest updateStockRequest(@PathVariable UUID id, @RequestBody StockRequestStatusUpdate request) {
        return productService.updateStockRequestStatus(id, parseStockRequestStatus(request.status()));
    }

    /* --------------------------------- helpers --------------------------------- */

    private ProductCategory parseCategory(String value) {
        if (value == null) return null;
        try {
            return ProductCategory.valueOf(value.toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid category: " + value);
        }
    }

    private AllocationStatus parseAllocationStatus(String value) {
        if (value == null) return null;
        try {
            return AllocationStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid status: " + value);
        }
    }

    private ApprovalStatus parseApprovalStatus(String value) {
        try {
            return ApprovalStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid approvalStatus: " + value);
        }
    }

    private StockRequestStatus parseStockRequestStatus(String value) {
        try {
            return StockRequestStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid status: " + value);
        }
    }
}
