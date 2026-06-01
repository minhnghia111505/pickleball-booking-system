package com.pickleball.backend.modules.statistics.controller;

import com.pickleball.backend.modules.statistics.dto.response.DashboardStatisticsResponse;
import com.pickleball.backend.modules.statistics.service.StatisticsService;
import com.pickleball.backend.response.ApiResponse;
import com.pickleball.backend.security.SecurityRoles;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
    public ResponseEntity<ApiResponse<DashboardStatisticsResponse>> getDashboard(
            @RequestParam(required = false) Integer days
    ) {
        DashboardStatisticsResponse dashboard = statisticsService.getDashboardStatistics(days);
        return ResponseEntity.ok(ApiResponse.success("Dashboard statistics retrieved successfully", dashboard));
    }
}
