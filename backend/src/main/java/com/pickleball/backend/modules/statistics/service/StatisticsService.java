package com.pickleball.backend.modules.statistics.service;

import com.pickleball.backend.modules.statistics.dto.response.DashboardStatisticsResponse;

public interface StatisticsService {

    DashboardStatisticsResponse getDashboardStatistics(Integer periodDays);
    DashboardStatisticsResponse getManagerDashboardStatistics(String userEmail, Integer periodDays);
}
