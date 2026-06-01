package com.pickleball.backend.modules.statistics.support;

import com.pickleball.backend.modules.booking.entity.BookingStatus;

import java.util.EnumSet;
import java.util.Set;

public final class StatisticsStatusGroups {

    /** Bookings included in revenue simulation (uses stored {@code totalAmount}). */
    public static final Set<BookingStatus> REVENUE_STATUSES = EnumSet.of(
            BookingStatus.CONFIRMED,
            BookingStatus.COMPLETED,
            BookingStatus.PENDING
    );

    /** Bookings counted in activity / top rankings (excludes cancelled). */
    public static final Set<BookingStatus> ACTIVITY_STATUSES = EnumSet.of(
            BookingStatus.PENDING,
            BookingStatus.CONFIRMED,
            BookingStatus.COMPLETED
    );

    private StatisticsStatusGroups() {
    }
}
