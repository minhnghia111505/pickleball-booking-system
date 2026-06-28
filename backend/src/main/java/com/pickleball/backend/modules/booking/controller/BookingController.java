package com.pickleball.backend.modules.booking.controller;

import com.pickleball.backend.modules.booking.dto.request.CreateBookingRequest;
import com.pickleball.backend.modules.booking.dto.response.BookingResponse;
import com.pickleball.backend.modules.booking.dto.response.CourtScheduleResponse;
import com.pickleball.backend.modules.booking.service.BookingService;
import com.pickleball.backend.response.ApiResponse;
import com.pickleball.backend.response.PageResponse;
import com.pickleball.backend.security.SecurityRoles;
import com.pickleball.backend.security.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('" + SecurityRoles.USER + "', '" + SecurityRoles.SUPER_ADMIN + "')")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody CreateBookingRequest request
    ) {
        String email = SecurityUtils.getCurrentUserEmail();
        BookingResponse booking = bookingService.createBooking(email, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking created successfully", booking));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('" + SecurityRoles.USER + "', '" + SecurityRoles.STAFF + "', '" + SecurityRoles.MANAGER + "', '" + SecurityRoles.SUPER_ADMIN + "')")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(@PathVariable Long id) {
        String email = SecurityUtils.getCurrentUserEmail();
        bookingService.cancelBooking(email, id);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", null));
    }
    
    @PostMapping("/{id}/pay")
    @PreAuthorize("hasAnyRole('" + SecurityRoles.USER + "', '" + SecurityRoles.STAFF + "', '" + SecurityRoles.MANAGER + "', '" + SecurityRoles.SUPER_ADMIN + "')")
    public ResponseEntity<ApiResponse<Void>> payBooking(@PathVariable Long id) {
        String email = SecurityUtils.getCurrentUserEmail();
        bookingService.payBooking(email, id);
        return ResponseEntity.ok(ApiResponse.success("Booking paid successfully (Mock)", null));
    }

    @GetMapping("/my-bookings")
    @PreAuthorize("hasAnyRole('" + SecurityRoles.USER + "', '" + SecurityRoles.SUPER_ADMIN + "')")
    public ResponseEntity<ApiResponse<PageResponse<BookingResponse>>> getMyBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Integer size
    ) {
        String email = SecurityUtils.getCurrentUserEmail();
        PageResponse<BookingResponse> bookings = bookingService.getMyBookings(email, page, size);
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
    }

    @GetMapping("/club")
    @PreAuthorize("hasAnyRole('" + SecurityRoles.STAFF + "', '" + SecurityRoles.MANAGER + "', '" + SecurityRoles.SUPER_ADMIN + "')")
    public ResponseEntity<ApiResponse<PageResponse<BookingResponse>>> getClubBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Integer size
    ) {
        String email = SecurityUtils.getCurrentUserEmail();
        PageResponse<BookingResponse> bookings = bookingService.getClubBookings(email, page, size);
        return ResponseEntity.ok(ApiResponse.success("Club bookings retrieved successfully", bookings));
    }

    @GetMapping("/court/{courtId}")
    @PreAuthorize("hasAnyRole('" + SecurityRoles.USER + "', '" + SecurityRoles.STAFF + "', '" + SecurityRoles.MANAGER + "', '" + SecurityRoles.SUPER_ADMIN + "')")
    public ResponseEntity<ApiResponse<CourtScheduleResponse>> getCourtSchedule(
            @PathVariable Long courtId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        CourtScheduleResponse schedule = bookingService.getCourtSchedule(courtId, date);
        return ResponseEntity.ok(ApiResponse.success("Court schedule retrieved successfully", schedule));
    }
}
