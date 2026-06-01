package com.pickleball.backend.modules.schedule.dto.response;

import com.pickleball.backend.modules.schedule.entity.ScheduleLockType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Builder
public class ScheduleLockResponse {

    private Long id;
    private Long courtId;
    private String courtName;
    private LocalDate lockDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private ScheduleLockType lockType;
    private String reason;
    private LocalDateTime createdAt;
}
