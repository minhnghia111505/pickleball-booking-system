package com.pickleball.backend.modules.booking.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BookingUserSummaryResponse {

    private Long id;
    private String fullName;
    private String email;
}
