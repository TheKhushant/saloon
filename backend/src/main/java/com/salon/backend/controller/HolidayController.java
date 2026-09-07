package com.salon.backend.controller;

import com.salon.backend.dto.common.HolidayRequest;
import com.salon.backend.entity.Branch;
import com.salon.backend.entity.Holiday;
import com.salon.backend.exception.ResourceNotFoundException;
import com.salon.backend.repository.BranchRepository;
import com.salon.backend.repository.HolidayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/holidays")
@RequiredArgsConstructor
public class HolidayController {

    private final HolidayRepository holidayRepository;
    private final BranchRepository branchRepository;

    @GetMapping
    public List<Holiday> list() {
        return holidayRepository.findAll();
    }

    @GetMapping("/{id}")
    public Holiday get(@PathVariable UUID id) {
        return holidayRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Holiday not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Holiday create(@RequestBody HolidayRequest request) {
        Branch branch = request.branchId() != null
                ? branchRepository.findById(request.branchId()).orElseThrow(() -> new ResourceNotFoundException("Branch not found"))
                : null;

        Holiday holiday = Holiday.builder()
                .date(request.date())
                .reason(request.reason())
                .closedAllDay(request.closedAllDay() == null || request.closedAllDay())
                .openTime(request.openTime())
                .closeTime(request.closeTime())
                .branch(branch)
                .build();
        return holidayRepository.save(holiday);
    }

    @PatchMapping("/{id}")
    public Holiday update(@PathVariable UUID id, @RequestBody HolidayRequest request) {
        Holiday holiday = get(id);
        if (request.date() != null) holiday.setDate(request.date());
        if (request.reason() != null) holiday.setReason(request.reason());
        if (request.closedAllDay() != null) holiday.setClosedAllDay(request.closedAllDay());
        if (request.openTime() != null) holiday.setOpenTime(request.openTime());
        if (request.closeTime() != null) holiday.setCloseTime(request.closeTime());
        return holidayRepository.save(holiday);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        if (!holidayRepository.existsById(id)) {
            throw new ResourceNotFoundException("Holiday not found");
        }
        holidayRepository.deleteById(id);
    }
}
