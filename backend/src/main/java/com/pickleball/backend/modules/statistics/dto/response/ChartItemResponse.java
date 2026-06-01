package com.pickleball.backend.modules.statistics.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

/**
 * Generic label/value pair for pie, bar, or doughnut charts.
 */
@Getter
@Builder
public class ChartItemResponse {

    private String label;
    private Long count;
    private BigDecimal amount;
}
