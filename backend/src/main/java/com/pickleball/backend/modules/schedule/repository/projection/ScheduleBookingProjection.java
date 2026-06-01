package com.pickleball.backend.modules.schedule.repository.projection;

import com.pickleball.backend.modules.booking.entity.BookingStatus;

import java.time.LocalDate;
import java.time.LocalTime;

public interface ScheduleBookingProjection {

    Long getId();

    LocalDate getBookingDate();

    LocalTime getStartTime();

    LocalTime getEndTime();

    BookingStatus getBookingStatus();
}
