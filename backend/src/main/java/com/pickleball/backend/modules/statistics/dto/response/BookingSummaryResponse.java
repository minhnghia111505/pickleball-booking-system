package com.pickleball.backend.modules.statistics.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class BookingSummaryResponse {

    private long totalBookings;
    private long pendingBookings;
    private long confirmedBookings;
    private long completedBookings;
    private long cancelledBookings;
    private BigDecimal totalRevenue;
}
