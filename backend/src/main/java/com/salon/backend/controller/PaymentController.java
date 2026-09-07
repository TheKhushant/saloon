package com.salon.backend.controller;

import com.salon.backend.dto.payment.PaymentUpdateRequest;
import com.salon.backend.entity.Payment;
import com.salon.backend.entity.PaymentMethod;
import com.salon.backend.entity.PaymentStatus;
import com.salon.backend.exception.ApiException;
import com.salon.backend.exception.ResourceNotFoundException;
import com.salon.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentRepository paymentRepository;

    /**
     * There's no payment gateway wired up yet (Razorpay/Stripe would sit
     * here) - this lets an admin record that a deposit/payment was
     * collected by some other means (cash, a card machine, a UPI transfer
     * they can see landed) and mark it PAID in the system, so the booking
     * accurately reflects what's actually happened.
     */
    @GetMapping("/api/admin/bookings/{bookingId}/payments")
    public List<Payment> listForBooking(@PathVariable UUID bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }

    @PatchMapping("/api/admin/payments/{id}")
    public Payment update(@PathVariable UUID id, @RequestBody PaymentUpdateRequest request) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (request.status() != null) {
            try {
                payment.setStatus(PaymentStatus.valueOf(request.status().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid status: " + request.status());
            }
        }
        if (request.method() != null) {
            try {
                payment.setMethod(PaymentMethod.valueOf(request.method().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid method: " + request.method());
            }
        }
        if (request.transactionRef() != null) {
            payment.setTransactionRef(request.transactionRef());
        }

        return paymentRepository.save(payment);
    }
}
