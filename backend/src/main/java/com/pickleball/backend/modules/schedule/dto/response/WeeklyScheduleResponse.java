package com.pickleball.backend.modules.schedule.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Builder
public class WeeklyScheduleResponse {

    private Long courtId;
    private String courtName;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private int slotDurationMinutes;
    private List<WeeklyDayScheduleResponse> days;
}
