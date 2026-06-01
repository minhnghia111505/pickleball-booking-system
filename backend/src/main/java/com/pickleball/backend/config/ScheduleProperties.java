package com.pickleball.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.schedule")
public record ScheduleProperties(
        int slotDurationMinutes,
        int weeklyDays
) {
}
