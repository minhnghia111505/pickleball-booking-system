package com.pickleball.backend.modules.schedule.controller;

import com.pickleball.backend.modules.schedule.dto.request.CreateScheduleLockRequest;
import com.pickleball.backend.modules.schedule.dto.response.AvailableSlotsResponse;
import com.pickleball.backend.modules.schedule.dto.response.DailyScheduleResponse;
import com.pickleball.backend.modules.schedule.dto.response.ScheduleLockResponse;
import com.pickleball.backend.modules.schedule.dto.response.WeeklyScheduleResponse;
import com.pickleball.backend.modules.schedule.service.ScheduleService;
import com.pickleball.backend.response.ApiResponse;
import com.pickleball.backend.security.SecurityRoles;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping("/courts/{courtId}/daily")
    @PreAuthorize("hasAnyRole('" + SecurityRoles.USER + "', '" + SecurityRoles.ADMIN + "')")
    public ResponseEntity<ApiResponse<DailyScheduleResponse>> getDailySchedule(
            @PathVariable Long courtId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        DailyScheduleResponse schedule = scheduleService.getDailySchedule(courtId, date);
        return ResponseEntity.ok(ApiResponse.success("Daily schedule retrieved successfully", schedule));
    }

    @GetMapping("/courts/{courtId}/available")
    @PreAuthorize("hasAnyRole('" + SecurityRoles.USER + "', '" + SecurityRoles.ADMIN + "')")
    public ResponseEntity<ApiResponse<AvailableSlotsResponse>> getAvailableSlots(
            @PathVariable Long courtId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        AvailableSlotsResponse slots = scheduleService.getAvailableSlots(courtId, date);
        return ResponseEntity.ok(ApiResponse.success("Available slots retrieved successfully", slots));
    }

    @GetMapping("/courts/{courtId}/weekly")
    @PreAuthorize("hasAnyRole('" + SecurityRoles.USER + "', '" + SecurityRoles.ADMIN + "')")
    public ResponseEntity<ApiResponse<WeeklyScheduleResponse>> getWeeklySchedule(
            @PathVariable Long courtId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate
    ) {
        WeeklyScheduleResponse schedule = scheduleService.getWeeklySchedule(courtId, startDate);
        return ResponseEntity.ok(ApiResponse.success("Weekly schedule retrieved successfully", schedule));
    }

    @PostMapping("/locks")
    @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
    public ResponseEntity<ApiResponse<ScheduleLockResponse>> createMaintenanceLock(
            @Valid @RequestBody CreateScheduleLockRequest request
    ) {
        ScheduleLockResponse lock = scheduleService.createMaintenanceLock(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Maintenance lock created successfully", lock));
    }

    @DeleteMapping("/locks/{lockId}")
    @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
    public ResponseEntity<ApiResponse<Void>> deleteMaintenanceLock(@PathVariable Long lockId) {
        scheduleService.deleteMaintenanceLock(lockId);
        return ResponseEntity.ok(ApiResponse.success("Maintenance lock removed successfully", null));
    }
}
