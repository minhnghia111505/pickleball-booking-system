package com.pickleball.backend.modules.schedule.support;

import com.pickleball.backend.modules.booking.repository.BookingRepository;
import com.pickleball.backend.modules.booking.support.BookingStatusGroups;
import com.pickleball.backend.modules.schedule.repository.ScheduleLockRepository;
import com.pickleball.backend.modules.schedule.repository.projection.ScheduleBookingProjection;
import com.pickleball.backend.modules.schedule.repository.projection.ScheduleLockProjection;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * Loads schedule source data with lightweight projections (no entity graphs).
 */
@Component
public class ScheduleDataLoader {

    private final BookingRepository bookingRepository;
    private final ScheduleLockRepository scheduleLockRepository;

    public ScheduleDataLoader(BookingRepository bookingRepository, ScheduleLockRepository scheduleLockRepository) {
        this.bookingRepository = bookingRepository;
        this.scheduleLockRepository = scheduleLockRepository;
    }

    public ScheduleDayData loadDay(Long courtId, LocalDate date) {
        List<ScheduleBookingProjection> bookings = bookingRepository.findScheduleProjectionsByCourtAndDate(
                courtId, date, BookingStatusGroups.COURT_SCHEDULE_STATUSES
        );
        List<ScheduleLockProjection> locks = scheduleLockRepository.findProjectionsByCourtAndDate(courtId, date);
        return new ScheduleDayData(date, bookings, locks);
    }

    public ScheduleRangeData loadRange(Long courtId, LocalDate startDate, LocalDate endDate) {
        List<ScheduleBookingProjection> bookings = bookingRepository.findScheduleProjectionsByCourtAndDateRange(
                courtId, startDate, endDate, BookingStatusGroups.COURT_SCHEDULE_STATUSES
        );
        List<ScheduleLockProjection> locks = scheduleLockRepository.findProjectionsByCourtAndDateRange(
                courtId, startDate, endDate
        );
        return new ScheduleRangeData(startDate, endDate, bookings, locks);
    }

    public record ScheduleDayData(
            LocalDate date,
            List<ScheduleBookingProjection> bookings,
            List<ScheduleLockProjection> locks
    ) {
    }

    public record ScheduleRangeData(
            LocalDate startDate,
            LocalDate endDate,
            List<ScheduleBookingProjection> bookings,
            List<ScheduleLockProjection> locks
    ) {
    }
}
