package com.pickleball.backend.modules.statistics.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TopUserStatResponse {

    private Long userId;
    private String fullName;
    private String email;
    private long bookingCount;
}
