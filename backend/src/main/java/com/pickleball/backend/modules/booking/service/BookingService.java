package com.pickleball.backend.modules.booking.service;

import com.pickleball.backend.modules.booking.dto.request.CreateBookingRequest;
import com.pickleball.backend.modules.booking.dto.response.BookingResponse;
import com.pickleball.backend.modules.booking.dto.response.CourtScheduleResponse;
import com.pickleball.backend.response.PageResponse;

import java.time.LocalDate;

public interface BookingService {

    BookingResponse createBooking(String userEmail, CreateBookingRequest request);

    void cancelBooking(String userEmail, Long bookingId);

    PageResponse<BookingResponse> getMyBookings(String userEmail, int page, Integer size);

    CourtScheduleResponse getCourtSchedule(Long courtId, LocalDate bookingDate);
}
