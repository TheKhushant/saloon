package com.salon.backend.controller;

import com.salon.backend.security.BranchScope;
import com.salon.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/overview")
    public DashboardService.OverviewStats overview(@RequestParam(required = false) UUID branchId) {
        return dashboardService.overview(BranchScope.resolve(branchId));
    }

    @GetMapping("/popular-services")
    public List<DashboardService.ServiceCount> popularServices(@RequestParam(required = false) UUID branchId) {
        return dashboardService.popularServices(BranchScope.resolve(branchId));
    }
}
