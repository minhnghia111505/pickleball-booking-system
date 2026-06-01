package com.pickleball.backend.modules.schedule.service;

import com.pickleball.backend.modules.schedule.dto.request.CreateScheduleLockRequest;
import com.pickleball.backend.modules.schedule.dto.response.AvailableSlotsResponse;
import com.pickleball.backend.modules.schedule.dto.response.DailyScheduleResponse;
import com.pickleball.backend.modules.schedule.dto.response.ScheduleLockResponse;
import com.pickleball.backend.modules.schedule.dto.response.WeeklyScheduleResponse;

import java.time.LocalDate;

public interface ScheduleService {

    DailyScheduleResponse getDailySchedule(Long courtId, LocalDate date);

    AvailableSlotsResponse getAvailableSlots(Long courtId, LocalDate date);

    WeeklyScheduleResponse getWeeklySchedule(Long courtId, LocalDate startDate);

    ScheduleLockResponse createMaintenanceLock(CreateScheduleLockRequest request);

    void deleteMaintenanceLock(Long lockId);
}
