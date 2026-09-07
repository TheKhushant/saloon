package com.salon.backend.controller;

import com.salon.backend.dto.common.OfferRequest;
import com.salon.backend.entity.ApprovalStatus;
import com.salon.backend.entity.DiscountType;
import com.salon.backend.entity.Offer;
import com.salon.backend.exception.ApiException;
import com.salon.backend.exception.ResourceNotFoundException;
import com.salon.backend.repository.OfferRepository;
import com.salon.backend.security.AuthContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/offers")
@RequiredArgsConstructor
public class OfferController {

    private final OfferRepository offerRepository;

    @GetMapping
    public List<Offer> list(@RequestParam(required = false) String approvalStatus) {
        List<Offer> offers = offerRepository.findAll();
        if (approvalStatus != null) {
            var status = parseApprovalStatus(approvalStatus);
            offers = offers.stream().filter(o -> o.getApprovalStatus() == status).toList();
        }
        return offers;
    }

    @GetMapping("/{id}")
    public Offer get(@PathVariable UUID id) {
        return offerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Offer not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Offer create(@RequestBody OfferRequest request) {
        // Superadmin sits at the top of the approval chain - there's no one
        // above them to approve their offers, so an offer they add is
        // auto-approved and immediately visible to admins and on the public
        // site. Offers added by a branch admin still default to PENDING and
        // need superadmin approval before going live (same rule as Product).
        boolean isSuperadmin = AuthContext.current().isSuperadmin();
        Offer offer = Offer.builder()
                .title(request.title())
                .code(request.code() != null ? request.code().toUpperCase() : null)
                .discountType(parseDiscountType(request.discountType()))
                .discountValue(request.discountValue())
                .active(request.active() == null || request.active())
                .approvalStatus(isSuperadmin ? ApprovalStatus.APPROVED : ApprovalStatus.PENDING)
                .expiresAt(request.expiresAt())
                .description(request.description())
                .build();
        return offerRepository.save(offer);
    }

    @PatchMapping("/{id}")
    public Offer update(@PathVariable UUID id, @RequestBody OfferRequest request) {
        Offer offer = get(id);
        if (request.title() != null) offer.setTitle(request.title());
        if (request.code() != null) offer.setCode(request.code().toUpperCase());
        if (request.discountType() != null) offer.setDiscountType(parseDiscountType(request.discountType()));
        if (request.discountValue() != null) offer.setDiscountValue(request.discountValue());
        if (request.active() != null) offer.setActive(request.active());
        if (request.expiresAt() != null) offer.setExpiresAt(request.expiresAt());
        if (request.description() != null) offer.setDescription(request.description());
        return offerRepository.save(offer);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        if (!offerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Offer not found");
        }
        offerRepository.deleteById(id);
    }

    @PatchMapping("/{id}/approve")
    public Offer approve(@PathVariable UUID id) {
        Offer offer = get(id);
        offer.setApprovalStatus(ApprovalStatus.APPROVED);
        return offerRepository.save(offer);
    }

    @PatchMapping("/{id}/reject")
    public Offer reject(@PathVariable UUID id) {
        Offer offer = get(id);
        offer.setApprovalStatus(ApprovalStatus.REJECTED);
        return offerRepository.save(offer);
    }

    private DiscountType parseDiscountType(String value) {
        if (value == null) return null;
        try {
            return DiscountType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "discountType must be PERCENTAGE or FIXED");
        }
    }

    private ApprovalStatus parseApprovalStatus(String value) {
        try {
            return ApprovalStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid approvalStatus: " + value);
        }
    }
}
