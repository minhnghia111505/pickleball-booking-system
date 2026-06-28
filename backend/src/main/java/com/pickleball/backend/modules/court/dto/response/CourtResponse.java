package com.pickleball.backend.modules.court.dto.response;

import com.pickleball.backend.modules.court.entity.CourtStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class CourtResponse {

    private Long id;
    private String name;
    private String address;
    private String description;
    private BigDecimal pricePerHour;
    private CourtStatus status;
    private String imageUrl;
    private Long clubId;
    private String clubName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
