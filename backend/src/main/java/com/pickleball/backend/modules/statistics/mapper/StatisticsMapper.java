package com.pickleball.backend.modules.statistics.mapper;

import com.pickleball.backend.modules.booking.entity.BookingStatus;
import com.pickleball.backend.modules.statistics.dto.response.ChartItemResponse;
import com.pickleball.backend.modules.statistics.dto.response.RevenueTrendItemResponse;
import com.pickleball.backend.modules.statistics.dto.response.TopCourtStatResponse;
import com.pickleball.backend.modules.statistics.dto.response.TopUserStatResponse;
import com.pickleball.backend.modules.statistics.repository.projection.BookingStatusCountProjection;
import com.pickleball.backend.modules.statistics.repository.projection.RevenueByDateProjection;
import com.pickleball.backend.modules.statistics.repository.projection.TopCourtProjection;
import com.pickleball.backend.modules.statistics.repository.projection.TopUserProjection;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Component
public class StatisticsMapper {

    public Map<BookingStatus, Long> toStatusCountMap(List<BookingStatusCountProjection> projections) {
        Map<BookingStatus, Long> counts = new EnumMap<>(BookingStatus.class);
        for (BookingStatusCountProjection projection : projections) {
            counts.put(projection.getBookingStatus(), projection.getCount());
        }
        return counts;
    }

    public List<ChartItemResponse> toBookingsByStatusChart(Map<BookingStatus, Long> statusCounts) {
        return statusCounts.entrySet().stream()
                .map(entry -> ChartItemResponse.builder()
                        .label(entry.getKey().name())
                        .count(entry.getValue())
                        .build())
                .toList();
    }

    public List<RevenueTrendItemResponse> toRevenueTrend(List<RevenueByDateProjection> projections) {
        return projections.stream()
                .map(item -> RevenueTrendItemResponse.builder()
                        .date(item.getBookingDate())
                        .amount(item.getAmount())
                        .build())
                .toList();
    }

    public List<TopCourtStatResponse> toTopCourts(List<TopCourtProjection> projections) {
        return projections.stream()
                .map(item -> TopCourtStatResponse.builder()
                        .courtId(item.getCourtId())
                        .courtName(item.getCourtName())
                        .bookingCount(item.getBookingCount())
                        .build())
                .toList();
    }

    public List<TopUserStatResponse> toTopUsers(List<TopUserProjection> projections) {
        return projections.stream()
                .map(item -> TopUserStatResponse.builder()
                        .userId(item.getUserId())
                        .fullName(item.getFullName())
                        .email(item.getEmail())
                        .bookingCount(item.getBookingCount())
                        .build())
                .toList();
    }
}
