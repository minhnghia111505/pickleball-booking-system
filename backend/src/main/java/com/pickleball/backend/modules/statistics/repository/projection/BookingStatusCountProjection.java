package com.pickleball.backend.modules.statistics.repository.projection;

import com.pickleball.backend.modules.booking.entity.BookingStatus;

public interface BookingStatusCountProjection {

    BookingStatus getBookingStatus();

    Long getCount();
}
