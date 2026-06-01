package com.pickleball.backend.modules.schedule.dto.response;

import com.pickleball.backend.modules.schedule.entity.ScheduleEventType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalTime;

@Getter
@Builder
public class ScheduleEventResponse {

    private Long id;
    private ScheduleEventType type;
    private LocalTime startTime;
    private LocalTime endTime;
    private String title;
}
