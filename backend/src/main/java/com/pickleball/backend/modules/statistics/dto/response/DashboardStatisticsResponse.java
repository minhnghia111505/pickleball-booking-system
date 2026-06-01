package com.pickleball.backend.modules.statistics.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class DashboardStatisticsResponse {

    private LocalDate startDate;
    private LocalDate endDate;
    private int periodDays;
    private BookingSummaryResponse summary;
    private List<ChartItemResponse> bookingsByStatus;
    private List<RevenueTrendItemResponse> revenueTrend;
    private List<TopCourtStatResponse> topCourts;
    private List<TopUserStatResponse> topUsers;
}
