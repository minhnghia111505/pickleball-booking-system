package com.pickleball.backend.modules.club.controller;

import com.pickleball.backend.modules.club.service.ManagerScheduleService;
import com.pickleball.backend.modules.schedule.dto.request.CreateScheduleLockRequest;
import com.pickleball.backend.modules.schedule.dto.response.ScheduleLockResponse;
import com.pickleball.backend.response.ApiResponse;
import com.pickleball.backend.response.PageResponse;
import com.pickleball.backend.security.SecurityRoles;
import com.pickleball.backend.security.util.SecurityUtils;
import jakarta.validation.Valid;
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

@RestController
@RequestMapping("/manager/schedules")
@PreAuthorize("hasRole('" + SecurityRoles.MANAGER + "')")
public class ManagerScheduleController {

    private final ManagerScheduleService managerScheduleService;

    public ManagerScheduleController(ManagerScheduleService managerScheduleService) {
        this.managerScheduleService = managerScheduleService;
    }

    @GetMapping("/courts/{courtId}/locks")
    public ResponseEntity<ApiResponse<PageResponse<ScheduleLockResponse>>> getScheduleLocks(
            @PathVariable Long courtId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Integer size
    ) {
        String email = SecurityUtils.getCurrentUserEmail();
        PageResponse<ScheduleLockResponse> locks = managerScheduleService.getScheduleLocks(email, courtId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Schedule locks retrieved successfully", locks));
    }

    @PostMapping("/locks")
    public ResponseEntity<ApiResponse<ScheduleLockResponse>> createScheduleLock(
            @Valid @RequestBody CreateScheduleLockRequest request
    ) {
        String email = SecurityUtils.getCurrentUserEmail();
        ScheduleLockResponse lock = managerScheduleService.createScheduleLock(email, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Schedule lock created successfully", lock));
    }

    @DeleteMapping("/locks/{lockId}")
    public ResponseEntity<ApiResponse<Void>> deleteScheduleLock(@PathVariable Long lockId) {
        String email = SecurityUtils.getCurrentUserEmail();
        managerScheduleService.deleteScheduleLock(email, lockId);
        return ResponseEntity.ok(ApiResponse.success("Schedule lock removed successfully", null));
    }
}
