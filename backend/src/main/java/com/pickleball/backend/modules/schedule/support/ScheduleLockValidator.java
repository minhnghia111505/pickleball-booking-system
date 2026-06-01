package com.pickleball.backend.modules.schedule.support;

import com.pickleball.backend.config.BookingProperties;
import com.pickleball.backend.exception.BusinessException;
import com.pickleball.backend.modules.booking.repository.BookingRepository;
import com.pickleball.backend.modules.booking.support.BookingStatusGroups;
import com.pickleball.backend.modules.schedule.repository.ScheduleLockRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class ScheduleLockValidator {

    private final BookingProperties bookingProperties;
    private final BookingRepository bookingRepository;
    private final ScheduleLockRepository scheduleLockRepository;

    public ScheduleLockValidator(
            BookingProperties bookingProperties,
            BookingRepository bookingRepository,
            ScheduleLockRepository scheduleLockRepository
    ) {
        this.bookingProperties = bookingProperties;
        this.bookingRepository = bookingRepository;
        this.scheduleLockRepository = scheduleLockRepository;
    }

    public void validateLockWindow(LocalDate lockDate, LocalTime startTime, LocalTime endTime) {
        if (!startTime.isBefore(endTime)) {
            throw new BusinessException("Start time must be before end time");
        }

        if (startTime.isBefore(bookingProperties.openingTime())
                || endTime.isAfter(bookingProperties.closingTime())) {
            throw new BusinessException(
                    "Lock time must be within operating hours "
                            + bookingProperties.openingTime()
                            + " - "
                            + bookingProperties.closingTime()
            );
        }

        if (lockDate.isBefore(LocalDate.now())) {
            throw new BusinessException("Cannot lock schedule for a past date");
        }
    }

    public void assertNoConflicts(Long courtId, LocalDate lockDate, LocalTime startTime, LocalTime endTime) {
        boolean bookingConflict = bookingRepository.existsOverlappingBooking(
                courtId,
                lockDate,
                startTime,
                endTime,
                BookingStatusGroups.BLOCKING_STATUSES
        );
        if (bookingConflict) {
            throw new BusinessException("Cannot lock schedule: existing booking in this time range");
        }

        boolean lockConflict = scheduleLockRepository.existsOverlappingLock(
                courtId, lockDate, startTime, endTime
        );
        if (lockConflict) {
            throw new BusinessException("Schedule lock overlaps with an existing maintenance lock");
        }
    }
}
