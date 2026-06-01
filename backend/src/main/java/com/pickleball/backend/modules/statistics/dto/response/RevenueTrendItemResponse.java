package com.pickleball.backend.modules.statistics.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Daily revenue point for line/area charts. */
@Getter
@Builder
public class RevenueTrendItemResponse {

    private LocalDate date;
    private BigDecimal amount;
}
