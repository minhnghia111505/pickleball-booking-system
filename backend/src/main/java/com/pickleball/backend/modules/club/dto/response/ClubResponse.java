package com.pickleball.backend.modules.club.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ClubResponse {
    private Long id;
    private String name;
    private String address;
    private String phone;
    private String email;
    private String description;
    private String logoUrl;
    private String status;
    private java.time.LocalTime openTime;
    private java.time.LocalTime closeTime;
}
