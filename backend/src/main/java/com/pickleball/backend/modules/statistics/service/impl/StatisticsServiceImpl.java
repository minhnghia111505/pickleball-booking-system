package com.pickleball.backend.modules.statistics.service.impl;

import com.pickleball.backend.config.StatisticsProperties;
import com.pickleball.backend.modules.booking.entity.BookingStatus;
import com.pickleball.backend.modules.statistics.dto.response.BookingSummaryResponse;
import com.pickleball.backend.modules.statistics.dto.response.ChartItemResponse;
import com.pickleball.backend.modules.statistics.dto.response.DashboardStatisticsResponse;
import com.pickleball.backend.modules.statistics.dto.response.RevenueTrendItemResponse;
import com.pickleball.backend.modules.statistics.dto.response.TopCourtStatResponse;
import com.pickleball.backend.modules.statistics.dto.response.TopUserStatResponse;
import com.pickleball.backend.modules.statistics.mapper.StatisticsMapper;
import com.pickleball.backend.modules.statistics.repository.StatisticsBookingRepository;
import com.pickleball.backend.modules.statistics.repository.projection.BookingStatusCountProjection;
import com.pickleball.backend.modules.statistics.repository.projection.RevenueByDateProjection;
import com.pickleball.backend.modules.statistics.repository.projection.TopCourtProjection;
import com.pickleball.backend.modules.statistics.repository.projection.TopUserProjection;
import com.pickleball.backend.modules.statistics.service.StatisticsService;
import com.pickleball.backend.modules.statistics.support.StatisticsStatusGroups;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class StatisticsServiceImpl implements StatisticsService {

    private final StatisticsBookingRepository statisticsBookingRepository;
    private final StatisticsMapper statisticsMapper;
    private final StatisticsProperties statisticsProperties;
    private final com.pickleball.backend.modules.user.repository.UserRepository userRepository;

    public StatisticsServiceImpl(
            StatisticsBookingRepository statisticsBookingRepository,
            StatisticsMapper statisticsMapper,
            StatisticsProperties statisticsProperties,
            com.pickleball.backend.modules.user.repository.UserRepository userRepository
    ) {
        this.statisticsBookingRepository = statisticsBookingRepository;
        this.statisticsMapper = statisticsMapper;
        this.statisticsProperties = statisticsProperties;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatisticsResponse getDashboardStatistics(Integer periodDays) {
        int resolvedPeriodDays = resolvePeriodDays(periodDays);
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(resolvedPeriodDays - 1L);

        long totalBookings = statisticsBookingRepository.countBookingsInPeriod(startDate, endDate);

        List<BookingStatusCountProjection> statusCounts = statisticsBookingRepository.countBookingsGroupByStatus(
                startDate, endDate
        );
        Map<BookingStatus, Long> statusCountMap = statisticsMapper.toStatusCountMap(statusCounts);

        BigDecimal totalRevenue = statisticsBookingRepository.sumRevenueInPeriod(
                startDate, endDate, StatisticsStatusGroups.REVENUE_STATUSES
        );

        List<ChartItemResponse> bookingsByStatus = statisticsMapper.toBookingsByStatusChart(statusCountMap);

        List<RevenueByDateProjection> revenueByDate = statisticsBookingRepository.sumRevenueGroupByDate(
                startDate, endDate, StatisticsStatusGroups.REVENUE_STATUSES
        );
        List<RevenueTrendItemResponse> revenueTrend = statisticsMapper.toRevenueTrend(revenueByDate);

        PageRequest topPage = PageRequest.of(0, statisticsProperties.topLimit());
        List<TopCourtProjection> topCourtRows = statisticsBookingRepository.findTopCourtsByBookings(
                startDate, endDate, StatisticsStatusGroups.ACTIVITY_STATUSES, topPage
        );
        List<TopCourtStatResponse> topCourts = statisticsMapper.toTopCourts(topCourtRows);

        List<TopUserProjection> topUserRows = statisticsBookingRepository.findTopUsersByBookings(
                startDate, endDate, StatisticsStatusGroups.ACTIVITY_STATUSES, topPage
        );
        List<TopUserStatResponse> topUsers = statisticsMapper.toTopUsers(topUserRows);

        BookingSummaryResponse summary = BookingSummaryResponse.builder()
                .totalBookings(totalBookings)
                .pendingBookings(statusCountMap.getOrDefault(BookingStatus.PENDING, 0L))
                .confirmedBookings(statusCountMap.getOrDefault(BookingStatus.CONFIRMED, 0L))
                .completedBookings(statusCountMap.getOrDefault(BookingStatus.COMPLETED, 0L))
                .cancelledBookings(statusCountMap.getOrDefault(BookingStatus.CANCELLED, 0L))
                .totalRevenue(totalRevenue)
                .build();

        return DashboardStatisticsResponse.builder()
                .startDate(startDate)
                .endDate(endDate)
                .periodDays(resolvedPeriodDays)
                .summary(summary)
                .bookingsByStatus(bookingsByStatus)
                .revenueTrend(revenueTrend)
                .topCourts(topCourts)
                .topUsers(topUsers)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatisticsResponse getManagerDashboardStatistics(String userEmail, Integer periodDays) {
        com.pickleball.backend.modules.user.entity.User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new com.pickleball.backend.exception.ResourceNotFoundException("User not found"));
                
        if (user.getClub() == null) {
            throw new com.pickleball.backend.exception.BusinessException("You do not belong to any club.");
        }
        
        Long clubId = user.getClub().getId();
        int resolvedPeriodDays = resolvePeriodDays(periodDays);
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(resolvedPeriodDays - 1L);

        long totalBookings = statisticsBookingRepository.countBookingsInPeriodByClubId(clubId, startDate, endDate);

        List<BookingStatusCountProjection> statusCounts = statisticsBookingRepository.countBookingsGroupByStatusByClubId(
                clubId, startDate, endDate
        );
        Map<BookingStatus, Long> statusCountMap = statisticsMapper.toStatusCountMap(statusCounts);

        BigDecimal totalRevenue = statisticsBookingRepository.sumRevenueInPeriodByClubId(
                clubId, startDate, endDate, StatisticsStatusGroups.REVENUE_STATUSES
        );

        List<ChartItemResponse> bookingsByStatus = statisticsMapper.toBookingsByStatusChart(statusCountMap);

        List<RevenueByDateProjection> revenueByDate = statisticsBookingRepository.sumRevenueGroupByDateByClubId(
                clubId, startDate, endDate, StatisticsStatusGroups.REVENUE_STATUSES
        );
        List<RevenueTrendItemResponse> revenueTrend = statisticsMapper.toRevenueTrend(revenueByDate);

        PageRequest topPage = PageRequest.of(0, statisticsProperties.topLimit());
        List<TopCourtProjection> topCourtRows = statisticsBookingRepository.findTopCourtsByBookingsByClubId(
                clubId, startDate, endDate, StatisticsStatusGroups.ACTIVITY_STATUSES, topPage
        );
        List<TopCourtStatResponse> topCourts = statisticsMapper.toTopCourts(topCourtRows);

        List<TopUserProjection> topUserRows = statisticsBookingRepository.findTopUsersByBookingsByClubId(
                clubId, startDate, endDate, StatisticsStatusGroups.ACTIVITY_STATUSES, topPage
        );
        List<TopUserStatResponse> topUsers = statisticsMapper.toTopUsers(topUserRows);

        BookingSummaryResponse summary = BookingSummaryResponse.builder()
                .totalBookings(totalBookings)
                .pendingBookings(statusCountMap.getOrDefault(BookingStatus.PENDING, 0L))
                .confirmedBookings(statusCountMap.getOrDefault(BookingStatus.CONFIRMED, 0L))
                .completedBookings(statusCountMap.getOrDefault(BookingStatus.COMPLETED, 0L))
                .cancelledBookings(statusCountMap.getOrDefault(BookingStatus.CANCELLED, 0L))
                .totalRevenue(totalRevenue)
                .build();

        return DashboardStatisticsResponse.builder()
                .startDate(startDate)
                .endDate(endDate)
                .periodDays(resolvedPeriodDays)
                .summary(summary)
                .bookingsByStatus(bookingsByStatus)
                .revenueTrend(revenueTrend)
                .topCourts(topCourts)
                .topUsers(topUsers)
                .build();
    }

    private int resolvePeriodDays(Integer periodDays) {
        if (periodDays == null || periodDays < 1) {
            return statisticsProperties.defaultPeriodDays();
        }
        return periodDays;
    }
}
