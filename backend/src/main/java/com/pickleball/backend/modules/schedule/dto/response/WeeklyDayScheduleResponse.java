package com.pickleball.backend.modules.schedule.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class WeeklyDayScheduleResponse {

    private LocalDate date;
    private List<ScheduleEventResponse> events;
    private List<ScheduleSlotResponse> slots;
    private int availableSlotCount;
}
