package com.pickleball.backend.modules.booking.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BookingCourtSummaryResponse {

    private Long id;
    private String name;
    private String address;
}
