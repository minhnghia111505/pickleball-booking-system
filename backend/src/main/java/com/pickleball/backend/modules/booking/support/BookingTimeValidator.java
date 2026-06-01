package com.pickleball.backend.modules.booking.support;

import com.pickleball.backend.config.BookingProperties;
import com.pickleball.backend.exception.BusinessException;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
public class BookingTimeValidator {

    private final BookingProperties bookingProperties;

    public BookingTimeValidator(BookingProperties bookingProperties) {
        this.bookingProperties = bookingProperties;
    }

    public void validate(LocalDate bookingDate, LocalTime startTime, LocalTime endTime) {
        if (bookingDate == null || startTime == null || endTime == null) {
            throw new BusinessException("Booking date and time range are required");
        }

        if (!startTime.isBefore(endTime)) {
            throw new BusinessException("Start time must be before end time");
        }

        long durationMinutes = Duration.between(startTime, endTime).toMinutes();
        if (durationMinutes < bookingProperties.minDurationMinutes()) {
            throw new BusinessException(
                    "Booking duration must be at least " + bookingProperties.minDurationMinutes() + " minutes"
            );
        }

        if (startTime.isBefore(bookingProperties.openingTime())
                || endTime.isAfter(bookingProperties.closingTime())) {
            throw new BusinessException(
                    "Booking time must be within operating hours "
                            + bookingProperties.openingTime()
                            + " - "
                            + bookingProperties.closingTime()
            );
        }

        LocalDate today = LocalDate.now();
        if (bookingDate.isBefore(today)) {
            throw new BusinessException("Booking date cannot be in the past");
        }

        if (bookingDate.isAfter(today.plusDays(bookingProperties.maxAdvanceDays()))) {
            throw new BusinessException(
                    "Booking date cannot be more than " + bookingProperties.maxAdvanceDays() + " days in advance"
            );
        }

        if (bookingDate.isEqual(today)) {
            LocalDateTime slotStart = LocalDateTime.of(bookingDate, startTime);
            if (!slotStart.isAfter(LocalDateTime.now())) {
                throw new BusinessException("Cannot book a time slot that has already started");
            }
        }
    }
}
