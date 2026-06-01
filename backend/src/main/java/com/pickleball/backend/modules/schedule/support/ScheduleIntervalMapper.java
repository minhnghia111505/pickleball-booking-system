package com.pickleball.backend.modules.schedule.support;

import com.pickleball.backend.modules.schedule.repository.projection.ScheduleBookingProjection;
import com.pickleball.backend.modules.schedule.repository.projection.ScheduleLockProjection;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Component
public class ScheduleIntervalMapper {

    public List<ScheduleBusyInterval> toBusyIntervals(
            List<ScheduleBookingProjection> bookings,
            List<ScheduleLockProjection> locks
    ) {
        List<ScheduleBusyInterval> intervals = new ArrayList<>();

        for (ScheduleBookingProjection booking : bookings) {
            intervals.add(new ScheduleBusyInterval(
                    booking.getId(),
                    ScheduleBusyType.BOOKING,
                    booking.getStartTime(),
                    booking.getEndTime(),
                    booking.getBookingStatus().name()
            ));
        }

        for (ScheduleLockProjection lock : locks) {
            intervals.add(new ScheduleBusyInterval(
                    lock.getId(),
                    ScheduleBusyType.MAINTENANCE_LOCK,
                    lock.getStartTime(),
                    lock.getEndTime(),
                    lock.getReason() != null ? lock.getReason() : "Maintenance"
            ));
        }

        intervals.sort(Comparator.comparing(ScheduleBusyInterval::startTime));
        return intervals;
    }
}
