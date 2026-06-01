package com.pickleball.backend.modules.booking.support;

import com.pickleball.backend.modules.court.entity.Court;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalTime;

@Component
public class BookingAmountCalculator {

    public BigDecimal calculate(Court court, LocalTime startTime, LocalTime endTime) {
        long minutes = Duration.between(startTime, endTime).toMinutes();
        BigDecimal hours = BigDecimal.valueOf(minutes)
                .divide(BigDecimal.valueOf(60), 4, RoundingMode.HALF_UP);
        return court.getPricePerHour()
                .multiply(hours)
                .setScale(2, RoundingMode.HALF_UP);
    }
}
