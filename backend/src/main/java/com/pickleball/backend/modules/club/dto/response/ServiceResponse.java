package com.pickleball.backend.modules.club.dto.response;

import lombok.Builder;
import lombok.Getter;
import java.math.BigDecimal;

@Getter
@Builder
public class ServiceResponse {
    private Long id;
    private Long clubId;
    private String name;
    private String type;
    private BigDecimal price;
    private String status;
    private String imageUrl;
}
