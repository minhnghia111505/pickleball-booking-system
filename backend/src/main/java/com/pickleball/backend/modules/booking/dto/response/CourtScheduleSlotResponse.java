package com.pickleball.backend.modules.booking.dto.response;

import com.pickleball.backend.modules.booking.entity.BookingStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalTime;

@Getter
@Builder
public class CourtScheduleSlotResponse {

    private Long bookingId;
    private LocalTime startTime;
    private LocalTime endTime;
    private BookingStatus bookingStatus;
}
