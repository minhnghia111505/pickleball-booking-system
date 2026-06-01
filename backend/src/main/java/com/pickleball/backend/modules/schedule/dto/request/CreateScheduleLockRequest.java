package com.pickleball.backend.modules.schedule.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class CreateScheduleLockRequest {

    @NotNull(message = "Court id is required")
    private Long courtId;

    @NotNull(message = "Lock date is required")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate lockDate;

    @NotNull(message = "Start time is required")
    @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
    private LocalTime endTime;

    @Size(max = 500, message = "Reason must not exceed 500 characters")
    private String reason;
}
