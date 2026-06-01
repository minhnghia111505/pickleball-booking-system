package com.pickleball.backend.modules.schedule.support;

import java.time.LocalTime;

public record ScheduleBusyInterval(
        Long sourceId,
        ScheduleBusyType type,
        LocalTime startTime,
        LocalTime endTime,
        String label
) {
}
