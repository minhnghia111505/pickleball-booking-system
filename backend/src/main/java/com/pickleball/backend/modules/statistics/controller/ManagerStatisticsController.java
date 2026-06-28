package com.pickleball.backend.modules.statistics.controller;

import com.pickleball.backend.modules.statistics.dto.response.DashboardStatisticsResponse;
import com.pickleball.backend.modules.statistics.service.StatisticsService;
import com.pickleball.backend.response.ApiResponse;
import com.pickleball.backend.security.SecurityRoles;
import com.pickleball.backend.security.util.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/manager/statistics")
public class ManagerStatisticsController {

    private final StatisticsService statisticsService;

    public ManagerStatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping("/overview")
    @PreAuthorize("hasAnyRole('" + SecurityRoles.MANAGER + "', '" + SecurityRoles.STAFF + "')")
    public ResponseEntity<ApiResponse<DashboardStatisticsResponse>> getOverview(
            @RequestParam(required = false) Integer days
    ) {
        String email = SecurityUtils.getCurrentUserEmail();
        DashboardStatisticsResponse dashboard = statisticsService.getManagerDashboardStatistics(email, days);
        return ResponseEntity.ok(ApiResponse.success("Manager dashboard statistics retrieved successfully", dashboard));
    }
}
