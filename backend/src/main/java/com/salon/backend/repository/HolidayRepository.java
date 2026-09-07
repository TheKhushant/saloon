package com.salon.backend.repository;

import com.salon.backend.entity.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface HolidayRepository extends JpaRepository<Holiday, UUID> {
    // Returns any holidays matching the date, both branch-specific and global.
    // A List rather than Optional because both a global and a branch-specific
    // holiday could technically exist on the same date - the caller decides
    // precedence (see AvailabilityService).
    @org.springframework.data.jpa.repository.Query(
        "select h from Holiday h where h.date = :date and (h.branch.id = :branchId or h.branch is null)")
    List<Holiday> findForBranchAndDate(UUID branchId, LocalDate date);
}
