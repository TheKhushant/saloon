package com.salon.backend.service;

import com.salon.backend.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BookingRepository bookingRepository;

    public record OverviewStats(
            long todayBookings, long monthBookings,
            BigDecimal todayRevenue, BigDecimal monthRevenue,
            int occupancyRate) {
    }

    public record ServiceCount(String name, long count) {
    }

    private static final int ASSUMED_DAILY_CAPACITY = 40;

    /**
     * All four numbers are computed in Postgres (COUNT/SUM/GROUP BY), not by
     * pulling booking rows into Java - see the aggregation queries on
     * BookingRepository. Only the four resulting scalars cross into the JVM.
     */
    public OverviewStats overview(UUID branchId) {
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);

        long todayBookings = bookingRepository.countForBranchAndDate(branchId, today);
        long monthBookings = bookingRepository.countForBranchAndDateRange(branchId, monthStart, today);
        BigDecimal todayRevenue = bookingRepository.sumRevenueForBranchAndDate(branchId, today);
        BigDecimal monthRevenue = bookingRepository.sumRevenueForBranchAndDateRange(branchId, monthStart, today);

        int occupancy = Math.min(100, (int) Math.round((todayBookings * 100.0) / ASSUMED_DAILY_CAPACITY));

        return new OverviewStats(todayBookings, monthBookings, todayRevenue, monthRevenue, occupancy);
    }

    public List<ServiceCount> popularServices(UUID branchId) {
        List<Object[]> rows = bookingRepository.popularServices(branchId, PageRequest.of(0, 5));
        return rows.stream()
                .map(r -> new ServiceCount((String) r[0], (Long) r[1]))
                .toList();
    }
}
