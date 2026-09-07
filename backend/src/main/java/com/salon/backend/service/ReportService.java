package com.salon.backend.service;

import com.salon.backend.entity.BookingStatus;
import com.salon.backend.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final BookingRepository bookingRepository;

    public record NamedCount(String name, long count) {
    }

    public record StatusCount(String status, long count) {
    }

    public record RevenuePoint(String date, BigDecimal revenue) {
    }

    public record ReportSummary(
            long totalBookings,
            BigDecimal totalRevenue,
            BigDecimal avgTicket,
            int cancellationRate,
            List<RevenuePoint> revenueTrend,
            List<StatusCount> bookingsByStatus,
            List<NamedCount> topServices,
            List<NamedCount> topBarbers) {
    }

    /**
     * Every number here is computed in Postgres via COUNT/SUM/GROUP BY
     * (see the aggregation queries on BookingRepository) - no full Booking
     * rows are pulled into Java just to be reduced in memory.
     */
    public ReportSummary summary(UUID branchId, LocalDate from, LocalDate to) {
        long totalBookings = bookingRepository.countForReport(branchId, from, to);
        long cancelledCount = bookingRepository.countCancelledForReport(branchId, from, to);
        BigDecimal totalRevenue = bookingRepository.sumRevenueForReport(branchId, from, to);

        long nonCancelledCount = totalBookings - cancelledCount;
        BigDecimal avgTicket = nonCancelledCount == 0
                ? BigDecimal.ZERO
                : totalRevenue.divide(BigDecimal.valueOf(nonCancelledCount), 0, RoundingMode.HALF_UP);

        int cancellationRate = totalBookings == 0 ? 0 : (int) Math.round((cancelledCount * 100.0) / totalBookings);

        List<RevenuePoint> revenueTrend = bookingRepository.revenueTrend(branchId, from, to).stream()
                .map(r -> new RevenuePoint(r[0].toString(), (BigDecimal) r[1]))
                .toList();

        List<StatusCount> bookingsByStatus = bookingRepository.bookingsByStatus(branchId, from, to).stream()
                .map(r -> new StatusCount(((BookingStatus) r[0]).name(), (Long) r[1]))
                .toList();

        List<NamedCount> topServices = bookingRepository.topServicesForReport(branchId, from, to, PageRequest.of(0, 5))
                .stream()
                .map(r -> new NamedCount((String) r[0], (Long) r[1]))
                .toList();

        List<NamedCount> topBarbers = bookingRepository.topBarbersForReport(branchId, from, to, PageRequest.of(0, 5))
                .stream()
                .map(r -> new NamedCount((String) r[0], (Long) r[1]))
                .toList();

        return new ReportSummary(totalBookings, totalRevenue, avgTicket, cancellationRate,
                revenueTrend, bookingsByStatus, topServices, topBarbers);
    }
}
