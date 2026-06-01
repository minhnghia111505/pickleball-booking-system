package com.pickleball.backend.modules.statistics.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TopCourtStatResponse {

    private Long courtId;
    private String courtName;
    private long bookingCount;
}
