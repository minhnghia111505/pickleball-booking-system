package com.pickleball.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.statistics")
public record StatisticsProperties(
        int topLimit,
        int defaultPeriodDays
) {
}
