package com.pickleball.backend.modules.booking.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class CourtScheduleResponse {

    private Long courtId;
    private String courtName;
    private LocalDate bookingDate;
    private List<CourtScheduleSlotResponse> slots;
}
