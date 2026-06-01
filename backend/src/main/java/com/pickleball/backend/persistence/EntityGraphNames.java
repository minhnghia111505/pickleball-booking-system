package com.pickleball.backend.persistence;

/**
 * Central names for {@link jakarta.persistence.NamedEntityGraph} to avoid string duplication
 * across repositories.
 */
public final class EntityGraphNames {

    public static final String BOOKING_WITH_DETAILS = "Booking.withDetails";

    public static final String SCHEDULE_LOCK_WITH_COURT = "ScheduleLock.withCourt";

    private EntityGraphNames() {
    }
}
