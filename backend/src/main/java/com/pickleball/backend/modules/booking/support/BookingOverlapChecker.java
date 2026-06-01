package com.pickleball.backend.modules.booking.support;

import com.pickleball.backend.exception.BusinessException;
import com.pickleball.backend.modules.booking.entity.Booking;
import com.pickleball.backend.modules.booking.entity.BookingStatus;
import com.pickleball.backend.modules.booking.repository.BookingRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;

/**
 * Detects time-slot conflicts on the same court and date.
 * <p>
 * Intervals {@code [start, end)} overlap when {@code startA < endB && startB < endA}.
 */
@Component
public class BookingOverlapChecker {

    private final BookingRepository bookingRepository;

    public BookingOverlapChecker(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public void assertNoOverlap(
            Long courtId,
            LocalDate bookingDate,
            LocalTime startTime,
            LocalTime endTime,
            Collection<BookingStatus> activeStatuses
    ) {
        boolean overlapping = bookingRepository.existsOverlappingBooking(
                courtId, bookingDate, startTime, endTime, activeStatuses
        );
        if (overlapping) {
            throw new BusinessException("This time slot is already booked for the selected court");
        }
    }

    public void assertNoOverlapWithLock(
            Long courtId,
            LocalDate bookingDate,
            LocalTime startTime,
            LocalTime endTime,
            Collection<BookingStatus> activeStatuses
    ) {
        List<Booking> lockedBookings = bookingRepository.findActiveBookingsForCourtAndDateWithLock(
                courtId, bookingDate, activeStatuses
        );

        boolean overlapping = lockedBookings.stream()
                .anyMatch(existing -> overlaps(existing.getStartTime(), existing.getEndTime(), startTime, endTime));

        if (overlapping) {
            throw new BusinessException("This time slot is already booked for the selected court");
        }
    }

    public boolean overlaps(LocalTime startA, LocalTime endA, LocalTime startB, LocalTime endB) {
        return startA.isBefore(endB) && startB.isBefore(endA);
    }
}
