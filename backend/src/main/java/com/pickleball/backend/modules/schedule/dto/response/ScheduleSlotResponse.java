package com.pickleball.backend.modules.schedule.dto.response;

import com.pickleball.backend.modules.schedule.entity.ScheduleSlotStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalTime;

@Getter
@Builder
public class ScheduleSlotResponse {

    private LocalTime startTime;
    private LocalTime endTime;
    private ScheduleSlotStatus status;
}
