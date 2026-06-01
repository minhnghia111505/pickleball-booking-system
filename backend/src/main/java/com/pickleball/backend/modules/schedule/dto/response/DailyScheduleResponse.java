package com.pickleball.backend.modules.schedule.dto.response;

import com.pickleball.backend.modules.court.entity.CourtStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Builder
public class DailyScheduleResponse {

    private Long courtId;
    private String courtName;
    private CourtStatus courtStatus;
    private LocalDate date;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private int slotDurationMinutes;
    private List<ScheduleEventResponse> events;
    private List<ScheduleSlotResponse> slots;
}
