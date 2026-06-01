package com.pickleball.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.LocalTime;

@ConfigurationProperties(prefix = "app.booking")
public record BookingProperties(
        int minDurationMinutes,
        int maxAdvanceDays,
        LocalTime openingTime,
        LocalTime closingTime,
        boolean requirePaymentBeforeConfirm
) {
}
