package com.salon.backend.repository;

import com.salon.backend.entity.Booking;
import com.salon.backend.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID>, org.springframework.data.jpa.repository.JpaSpecificationExecutor<Booking> {

    List<Booking> findByUserIdOrderByDateDesc(UUID userId);

    long countByBranchIdAndDate(UUID branchId, LocalDate date);

    long countByBranchIdAndDateGreaterThanEqual(UUID branchId, LocalDate date);

    @Query("select b from Booking b where b.branch.id = :branchId and b.barberRef.id = :barberId " +
           "and b.date = :date and b.time = :time and b.status in ('PENDING', 'CONFIRMED')")
    List<Booking> findClashingSlot(UUID branchId, UUID barberId, LocalDate date, String time);

    @Query("select b from Booking b where (:branchId is null or b.branch.id = :branchId) " +
           "and b.date >= current_date and b.status in ('PENDING', 'CONFIRMED') order by b.date, b.time")
    List<Booking> findUpcoming(UUID branchId, org.springframework.data.domain.Pageable pageable);

    List<Booking> findByBranchIdAndDateBetween(UUID branchId, LocalDate from, LocalDate to);

    boolean existsByBookingRef(String bookingRef);

    /**
     * Acquires a Postgres transaction-scoped advisory lock keyed to a single
     * branch+date+time slot. Held until the current transaction commits or
     * rolls back, then released automatically - no separate unlock call
     * needed. This is what makes the slot-capacity check in BookingService
     * safe under concurrency: two requests for the same slot are forced to
     * run the count-then-insert sequence one at a time instead of racing
     * (both reading count=4, both inserting, ending up with 6 in a slot
     * capped at 5). Requests for *different* slots don't block each other -
     * the lock key is scoped to the specific branch/date/time string.
     */
    @Query(value = "select pg_advisory_xact_lock(hashtext(:lockKey)::bigint)", nativeQuery = true)
    void lockSlot(String lockKey);

    @Query("select count(b) from Booking b where b.branch.id = :branchId and b.date = :date and b.time = :time " +
           "and b.status in ('PENDING', 'CONFIRMED')")
    long countActiveForSlot(UUID branchId, LocalDate date, String time);

    /* --------------------- Dashboard / report aggregations --------------------- *
     * These run the counting/summing in Postgres via GROUP BY / COUNT / SUM,
     * so only the small aggregated result set crosses into the JVM - not the
     * full set of matching Booking rows. All accept a nullable branchId
     * (null = every branch, for superadmin views).
     */

    @Query("select count(b) from Booking b where (:branchId is null or b.branch.id = :branchId) and b.date = :date")
    long countForBranchAndDate(UUID branchId, LocalDate date);

    @Query("select count(b) from Booking b where (:branchId is null or b.branch.id = :branchId) " +
           "and b.date between :from and :to")
    long countForBranchAndDateRange(UUID branchId, LocalDate from, LocalDate to);

    @Query("select coalesce(sum(b.total), 0) from Booking b where (:branchId is null or b.branch.id = :branchId) " +
           "and b.date = :date and b.status <> com.salon.backend.entity.BookingStatus.CANCELLED")
    java.math.BigDecimal sumRevenueForBranchAndDate(UUID branchId, LocalDate date);

    @Query("select coalesce(sum(b.total), 0) from Booking b where (:branchId is null or b.branch.id = :branchId) " +
           "and b.date between :from and :to and b.status <> com.salon.backend.entity.BookingStatus.CANCELLED")
    java.math.BigDecimal sumRevenueForBranchAndDateRange(UUID branchId, LocalDate from, LocalDate to);

    @Query("select b.service as name, count(b) as cnt from Booking b " +
           "where (:branchId is null or b.branch.id = :branchId) " +
           "and b.status <> com.salon.backend.entity.BookingStatus.CANCELLED " +
           "group by b.service order by cnt desc")
    List<Object[]> popularServices(UUID branchId, org.springframework.data.domain.Pageable pageable);

    @Query("select count(b) from Booking b where (:branchId is null or b.branch.id = :branchId) " +
           "and (:from is null or b.date >= :from) " +
           "and (:to is null or b.date <= :to)")
    long countForReport(UUID branchId, LocalDate from, LocalDate to);

    @Query("select coalesce(sum(b.total), 0) from Booking b where (:branchId is null or b.branch.id = :branchId) " +
           "and (:from is null or b.date >= :from) " +
           "and (:to is null or b.date <= :to) " +
           "and b.status <> com.salon.backend.entity.BookingStatus.CANCELLED")
    java.math.BigDecimal sumRevenueForReport(UUID branchId, LocalDate from, LocalDate to);

    @Query("select count(b) from Booking b where (:branchId is null or b.branch.id = :branchId) " +
           "and (:from is null or b.date >= :from) " +
           "and (:to is null or b.date <= :to) " +
           "and b.status = com.salon.backend.entity.BookingStatus.CANCELLED")
    long countCancelledForReport(UUID branchId, LocalDate from, LocalDate to);

    @Query("select b.date as d, sum(b.total) as revenue from Booking b " +
           "where (:branchId is null or b.branch.id = :branchId) " +
           "and (:from is null or b.date >= :from) " +
           "and (:to is null or b.date <= :to) " +
           "and b.status <> com.salon.backend.entity.BookingStatus.CANCELLED " +
           "group by b.date order by b.date")
    List<Object[]> revenueTrend(UUID branchId, LocalDate from, LocalDate to);

    @Query("select b.status as s, count(b) as cnt from Booking b " +
           "where (:branchId is null or b.branch.id = :branchId) " +
           "and (:from is null or b.date >= :from) " +
           "and (:to is null or b.date <= :to) " +
           "group by b.status")
    List<Object[]> bookingsByStatus(UUID branchId, LocalDate from, LocalDate to);

    @Query("select b.service as name, count(b) as cnt from Booking b " +
           "where (:branchId is null or b.branch.id = :branchId) " +
           "and (:from is null or b.date >= :from) " +
           "and (:to is null or b.date <= :to) " +
           "and b.status <> com.salon.backend.entity.BookingStatus.CANCELLED and b.service is not null " +
           "group by b.service order by cnt desc")
    List<Object[]> topServicesForReport(UUID branchId, LocalDate from, LocalDate to, org.springframework.data.domain.Pageable pageable);

    @Query("select b.barber as name, count(b) as cnt from Booking b " +
           "where (:branchId is null or b.branch.id = :branchId) " +
           "and (:from is null or b.date >= :from) " +
           "and (:to is null or b.date <= :to) " +
           "and b.status <> com.salon.backend.entity.BookingStatus.CANCELLED and b.barber is not null " +
           "group by b.barber order by cnt desc")
    List<Object[]> topBarbersForReport(UUID branchId, LocalDate from, LocalDate to, org.springframework.data.domain.Pageable pageable);
}
