package com.pickleball.backend.modules.booking.mapper;

import com.pickleball.backend.modules.booking.dto.response.BookingCourtSummaryResponse;
import com.pickleball.backend.modules.booking.dto.response.BookingResponse;
import com.pickleball.backend.modules.booking.dto.response.BookingUserSummaryResponse;
import com.pickleball.backend.modules.booking.dto.response.CourtScheduleSlotResponse;
import com.pickleball.backend.modules.booking.entity.Booking;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    public BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .user(toUserSummary(booking))
                .court(toCourtSummary(booking))
                .bookingDate(booking.getBookingDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .bookingStatus(booking.getBookingStatus())
                .totalAmount(booking.getTotalAmount())
                .paymentStatus(booking.getPaymentStatus())
                .paymentReference(booking.getPaymentReference())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }

    public CourtScheduleSlotResponse toScheduleSlot(Booking booking) {
        return CourtScheduleSlotResponse.builder()
                .bookingId(booking.getId())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .bookingStatus(booking.getBookingStatus())
                .build();
    }

    private BookingUserSummaryResponse toUserSummary(Booking booking) {
        return BookingUserSummaryResponse.builder()
                .id(booking.getUser().getId())
                .fullName(booking.getUser().getFullName())
                .email(booking.getUser().getEmail())
                .build();
    }

    private BookingCourtSummaryResponse toCourtSummary(Booking booking) {
        return BookingCourtSummaryResponse.builder()
                .id(booking.getCourt().getId())
                .name(booking.getCourt().getName())
                .address(booking.getCourt().getAddress())
                .build();
    }
}
