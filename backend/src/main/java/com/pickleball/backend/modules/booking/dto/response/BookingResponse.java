package com.pickleball.backend.modules.booking.dto.response;

import com.pickleball.backend.modules.booking.entity.BookingStatus;
import com.pickleball.backend.modules.booking.entity.PaymentStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Builder
public class BookingResponse {

    private Long id;
    private BookingUserSummaryResponse user;
    private BookingCourtSummaryResponse court;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private BookingStatus bookingStatus;
    private BigDecimal totalAmount;
    private PaymentStatus paymentStatus;
    private String paymentReference;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
