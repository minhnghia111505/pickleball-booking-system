package com.pickleball.backend.modules.club.service;

import com.pickleball.backend.modules.schedule.dto.request.CreateScheduleLockRequest;
import com.pickleball.backend.modules.schedule.dto.response.ScheduleLockResponse;
import com.pickleball.backend.response.PageResponse;

public interface ManagerScheduleService {
    PageResponse<ScheduleLockResponse> getScheduleLocks(String managerEmail, Long courtId, int page, Integer size);
    ScheduleLockResponse createScheduleLock(String managerEmail, CreateScheduleLockRequest request);
    void deleteScheduleLock(String managerEmail, Long lockId);
}
