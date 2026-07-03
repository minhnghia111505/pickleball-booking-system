package com.pickleball.backend.modules.club.controller;

import com.pickleball.backend.modules.club.dto.request.settings.UpdateClubSettingsRequest;
import com.pickleball.backend.modules.club.dto.response.ClubResponse;
import com.pickleball.backend.modules.club.service.ManagerClubSettingsService;
import com.pickleball.backend.response.ApiResponse;
import com.pickleball.backend.security.SecurityRoles;
import com.pickleball.backend.security.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/manager/club/settings")
@PreAuthorize("hasRole('" + SecurityRoles.MANAGER + "')")
public class ManagerClubSettingsController {

    private final ManagerClubSettingsService managerClubSettingsService;

    public ManagerClubSettingsController(ManagerClubSettingsService managerClubSettingsService) {
        this.managerClubSettingsService = managerClubSettingsService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ClubResponse>> getClubSettings() {
        String email = SecurityUtils.getCurrentUserEmail();
        ClubResponse club = managerClubSettingsService.getClubSettings(email);
        return ResponseEntity.ok(ApiResponse.success("Club settings retrieved successfully", club));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<ClubResponse>> updateClubSettings(
            @Valid @RequestBody UpdateClubSettingsRequest request
    ) {
        String email = SecurityUtils.getCurrentUserEmail();
        ClubResponse club = managerClubSettingsService.updateClubSettings(email, request);
        return ResponseEntity.ok(ApiResponse.success("Club settings updated successfully", club));
    }
}
