package com.pickleball.backend.modules.club.controller;

import com.pickleball.backend.modules.club.dto.request.staff.CreateStaffRequest;
import com.pickleball.backend.modules.club.dto.request.staff.UpdateStaffRequest;
import com.pickleball.backend.modules.club.dto.response.staff.StaffResponse;
import com.pickleball.backend.modules.club.service.ManagerStaffService;
import com.pickleball.backend.response.ApiResponse;
import com.pickleball.backend.response.PageResponse;
import com.pickleball.backend.security.SecurityRoles;
import com.pickleball.backend.security.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/manager/staffs")
@PreAuthorize("hasRole('" + SecurityRoles.MANAGER + "')")
public class ManagerStaffController {

    private final ManagerStaffService managerStaffService;

    public ManagerStaffController(ManagerStaffService managerStaffService) {
        this.managerStaffService = managerStaffService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<StaffResponse>>> getStaffs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Integer size
    ) {
        String email = SecurityUtils.getCurrentUserEmail();
        PageResponse<StaffResponse> staffs = managerStaffService.getStaffs(email, page, size);
        return ResponseEntity.ok(ApiResponse.success("Staffs retrieved successfully", staffs));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StaffResponse>> createStaff(
            @Valid @RequestBody CreateStaffRequest request
    ) {
        String email = SecurityUtils.getCurrentUserEmail();
        StaffResponse staff = managerStaffService.createStaff(email, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Staff created successfully", staff));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StaffResponse>> updateStaff(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStaffRequest request
    ) {
        String email = SecurityUtils.getCurrentUserEmail();
        StaffResponse staff = managerStaffService.updateStaff(email, id, request);
        return ResponseEntity.ok(ApiResponse.success("Staff updated successfully", staff));
    }
}
