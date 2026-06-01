package com.pickleball.backend.util;

import java.time.LocalTime;

public final class TimeIntervalUtils {

    private TimeIntervalUtils() {
    }

    /**
     * Returns true when half-open intervals {@code [startA, endA)} and {@code [startB, endB)} overlap.
     */
    public static boolean overlaps(LocalTime startA, LocalTime endA, LocalTime startB, LocalTime endB) {
        return startA.isBefore(endB) && startB.isBefore(endA);
    }
}
