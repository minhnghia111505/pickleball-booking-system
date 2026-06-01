package com.pickleball.backend.modules.booking.mapper;

import com.pickleball.backend.modules.booking.dto.response.BookingCourtSummaryResponse;
import com.pickleball.backend.modules.booking.dto.response.BookingResponse;
import com.pickleball.backend.modules.booking.dto.response.BookingUserSummaryResponse;
import com.pickleball.backend.modules.booking.dto.response.CourtScheduleSlotResponse;
import com.pickleball.backend.modules.booking.entity.Booking;
import com.pickleball.backend.modules.court.entity.Court;
import com.pickleball.backend.modules.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    /**
     * Maps booking with already-loaded associations (avoids lazy-load after persist).
     */
    public BookingResponse toResponse(Booking booking, User user, Court court) {
        return BookingResponse.builder()
                .id(booking.getId())
                .user(toUserSummary(user))
                .court(toCourtSummary(court))
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

    /**
     * Requires {@code user} and {@code court} initialized (entity graph or fetch join).
     */
    public BookingResponse toResponse(Booking booking) {
        return toResponse(booking, booking.getUser(), booking.getCourt());
    }

    public CourtScheduleSlotResponse toScheduleSlot(Booking booking) {
        return CourtScheduleSlotResponse.builder()
                .bookingId(booking.getId())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .bookingStatus(booking.getBookingStatus())
                .build();
    }

    private BookingUserSummaryResponse toUserSummary(User user) {
        return BookingUserSummaryResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }

    private BookingCourtSummaryResponse toCourtSummary(Court court) {
        return BookingCourtSummaryResponse.builder()
                .id(court.getId())
                .name(court.getName())
                .address(court.getAddress())
                .build();
    }
}
