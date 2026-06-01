package com.pickleball.backend.modules.booking.support;

import com.pickleball.backend.modules.booking.entity.BookingStatus;

import java.util.EnumSet;
import java.util.Set;

public final class BookingStatusGroups {

    public static final Set<BookingStatus> BLOCKING_STATUSES = EnumSet.of(
            BookingStatus.PENDING,
            BookingStatus.CONFIRMED
    );

    public static final Set<BookingStatus> COURT_SCHEDULE_STATUSES = EnumSet.of(
            BookingStatus.PENDING,
            BookingStatus.CONFIRMED,
            BookingStatus.COMPLETED
    );

    private BookingStatusGroups() {
    }
}
