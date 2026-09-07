// package com.salon.backend.entity;

// import jakarta.persistence.Column;
// import jakarta.persistence.Entity;
// import jakarta.persistence.Table;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Getter;
// import lombok.NoArgsConstructor;
// import lombok.Setter;

// // Singleton row - the service layer ensures exactly one Settings record
// // exists (creating it with defaults on first read if missing).
// @Entity
// @Table(name = "settings")
// @Getter
// @Setter
// @NoArgsConstructor
// @AllArgsConstructor
// @Builder
// public class Settings extends BaseEntity {

//     @Column(name = "business_name", nullable = false)
//     @Builder.Default
//     private String businessName = "My Salon";

//     private String phone;
//     private String email;
//     private String address;

//     @Column(nullable = false)
//     @Builder.Default
//     private String currency = "INR";

//     @Column(nullable = false)
//     @Builder.Default
//     private String timezone = "Asia/Kolkata";

//     @Column(name = "open_time", nullable = false)
//     @Builder.Default
//     private String openTime = "09:00";

//     @Column(name = "close_time", nullable = false)
//     @Builder.Default
//     private String closeTime = "20:00";

//     @Column(name = "slot_duration_minutes", nullable = false)
//     @Builder.Default
//     private Integer slotDurationMinutes = 30;

//     // How many bookings are allowed to share the same branch+date+time slot
//     // (e.g. 5 chairs = 5 concurrent bookings). Enforced with a database-level
//     // lock in BookingService, not just an application-side count check - see
//     // BookingRepository.lockSlot / countActiveForSlot.
//     @Column(name = "max_bookings_per_slot", nullable = false)
//     @Builder.Default
//     private Integer maxBookingsPerSlot = 5;

//     @Column(name = "allow_online_booking", nullable = false)
//     @Builder.Default
//     private boolean allowOnlineBooking = true;

//     @Column(name = "require_deposit_for_booking", nullable = false)
//     @Builder.Default
//     private boolean requireDepositForBooking = false;

//     // What percentage of the total a customer must pay upfront when
//     // requireDepositForBooking is on. Only meaningful when that flag is true.
//     @Column(name = "deposit_percentage", nullable = false)
//     @Builder.Default
//     private Integer depositPercentage = 20;
// }
package com.salon.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Singleton row - the service layer ensures exactly one Settings record
// exists (creating it with defaults on first read if missing).
@Entity
@Table(name = "settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Settings extends BaseEntity {

    @Column(name = "business_name", nullable = false)
    @Builder.Default
    private String businessName = "My Salon";

    @Builder.Default
    private String phone = "";

    @Builder.Default
    private String email = "";

    @Builder.Default
    private String address = "";

    @Column(nullable = false)
    @Builder.Default
    private String currency = "INR";

    @Column(nullable = false)
    @Builder.Default
    private String timezone = "Asia/Kolkata";

    @Column(name = "open_time", nullable = false)
    @Builder.Default
    private String openTime = "09:00";

    @Column(name = "close_time", nullable = false)
    @Builder.Default
    private String closeTime = "20:00";

    @Column(name = "slot_duration_minutes", nullable = false)
    @Builder.Default
    private Integer slotDurationMinutes = 30;

    // How many bookings are allowed to share the same branch+date+time slot
    // (e.g. 5 chairs = 5 concurrent bookings). Enforced with a database-level
    // lock in BookingService, not just an application-side count check - see
    // BookingRepository.lockSlot / countActiveForSlot.
    @Column(name = "max_bookings_per_slot", nullable = false)
    @Builder.Default
    private Integer maxBookingsPerSlot = 5;

    @Column(name = "allow_online_booking", nullable = false)
    @Builder.Default
    private boolean allowOnlineBooking = true;

    @Column(name = "require_deposit_for_booking", nullable = false)
    @Builder.Default
    private boolean requireDepositForBooking = false;

    // What percentage of the total a customer must pay upfront when
    // requireDepositForBooking is on. Only meaningful when that flag is true.
    @Column(name = "deposit_percentage", nullable = false)
    @Builder.Default
    private Integer depositPercentage = 20;
}