package com.pickleball.backend.modules.booking.service.impl;

import com.pickleball.backend.config.BookingProperties;
import com.pickleball.backend.config.PaginationProperties;
import com.pickleball.backend.exception.BusinessException;
import com.pickleball.backend.exception.ResourceNotFoundException;
import com.pickleball.backend.modules.booking.dto.request.CreateBookingRequest;
import com.pickleball.backend.modules.booking.dto.response.BookingResponse;
import com.pickleball.backend.modules.booking.dto.response.CourtScheduleResponse;
import com.pickleball.backend.modules.booking.dto.response.CourtScheduleSlotResponse;
import com.pickleball.backend.modules.booking.entity.Booking;
import com.pickleball.backend.modules.booking.entity.BookingStatus;
import com.pickleball.backend.modules.booking.entity.PaymentStatus;
import com.pickleball.backend.modules.booking.mapper.BookingMapper;
import com.pickleball.backend.modules.booking.repository.BookingRepository;
import com.pickleball.backend.modules.booking.service.BookingService;
import com.pickleball.backend.modules.booking.support.BookingAmountCalculator;
import com.pickleball.backend.modules.booking.support.BookingOverlapChecker;
import com.pickleball.backend.modules.booking.support.BookingStatusGroups;
import com.pickleball.backend.modules.booking.support.BookingTimeValidator;
import com.pickleball.backend.modules.court.entity.Court;
import com.pickleball.backend.modules.court.entity.CourtStatus;
import com.pickleball.backend.modules.court.repository.CourtRepository;
import com.pickleball.backend.modules.user.entity.User;
import com.pickleball.backend.modules.user.entity.UserStatus;
import com.pickleball.backend.modules.user.repository.UserRepository;
import com.pickleball.backend.modules.club.entity.ClubService;
import com.pickleball.backend.modules.club.entity.ServiceStatus;
import com.pickleball.backend.modules.club.repository.ClubServiceRepository;
import com.pickleball.backend.modules.booking.entity.BookingServiceItem;
import com.pickleball.backend.modules.booking.dto.request.ServiceRequest;
import java.math.BigDecimal;
import java.util.ArrayList;
import com.pickleball.backend.response.PageResponse;
import com.pickleball.backend.security.util.SecurityUtils;
import com.pickleball.backend.util.PageableUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final CourtRepository courtRepository;
    private final BookingMapper bookingMapper;
    private final BookingTimeValidator bookingTimeValidator;
    private final BookingOverlapChecker bookingOverlapChecker;
    private final BookingAmountCalculator bookingAmountCalculator;
    private final BookingProperties bookingProperties;
    private final PaginationProperties paginationProperties;
    private final ClubServiceRepository clubServiceRepository;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            CourtRepository courtRepository,
            BookingMapper bookingMapper,
            BookingTimeValidator bookingTimeValidator,
            BookingOverlapChecker bookingOverlapChecker,
            BookingAmountCalculator bookingAmountCalculator,
            BookingProperties bookingProperties,
            PaginationProperties paginationProperties,
            ClubServiceRepository clubServiceRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.courtRepository = courtRepository;
        this.bookingMapper = bookingMapper;
        this.bookingTimeValidator = bookingTimeValidator;
        this.bookingOverlapChecker = bookingOverlapChecker;
        this.bookingAmountCalculator = bookingAmountCalculator;
        this.bookingProperties = bookingProperties;
        this.paginationProperties = paginationProperties;
        this.clubServiceRepository = clubServiceRepository;
    }

    @Override
    @Transactional
    public BookingResponse createBooking(String userEmail, CreateBookingRequest request) {
        User user = findActiveUser(userEmail);
        Court court = findBookableCourt(request.getCourtId());

        bookingTimeValidator.validate(request.getBookingDate(), request.getStartTime(), request.getEndTime());

        bookingOverlapChecker.assertNoOverlapWithLock(
                court.getId(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime(),
                BookingStatusGroups.BLOCKING_STATUSES
        );

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setCourt(court);
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        
        List<BookingServiceItem> serviceItems = new ArrayList<>();
        if (request.getServices() != null && !request.getServices().isEmpty()) {
            for (ServiceRequest svcReq : request.getServices()) {
                ClubService service = clubServiceRepository.findById(svcReq.getServiceId())
                        .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + svcReq.getServiceId()));
                
                if (service.getStatus() != ServiceStatus.ACTIVE) {
                    throw new BusinessException("Service " + service.getName() + " is currently unavailable");
                }
                
                BookingServiceItem item = new BookingServiceItem();
                item.setBooking(booking);
                item.setService(service);
                item.setQuantity(svcReq.getQuantity());
                item.setUnitPrice(service.getPrice());
                item.setTotalPrice(service.getPrice().multiply(BigDecimal.valueOf(svcReq.getQuantity())));
                serviceItems.add(item);
            }
        }
        booking.getServices().addAll(serviceItems);
        
        booking.setTotalAmount(bookingAmountCalculator.calculate(court, request.getStartTime(), request.getEndTime(), serviceItems));
        booking.setPaymentStatus(PaymentStatus.UNPAID);

        if (bookingProperties.requirePaymentBeforeConfirm()) {
            booking.setBookingStatus(BookingStatus.PENDING);
        } else {
            booking.setBookingStatus(BookingStatus.CONFIRMED);
        }

        Booking saved = bookingRepository.save(booking);
        return bookingMapper.toResponse(saved, user, court);
    }

    @Override
    @Transactional
    public void payBooking(String userEmail, Long bookingId) {
        Booking booking = bookingRepository.findByIdWithUserAndCourt(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getEmail().equals(userEmail) && !SecurityUtils.isAdmin()) {
            throw new BusinessException("You are not allowed to pay for this booking");
        }

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new BusinessException("Cannot pay for a cancelled booking");
        }

        if (booking.getPaymentStatus() == PaymentStatus.PAID) {
            throw new BusinessException("Booking is already paid");
        }

        booking.setPaymentStatus(PaymentStatus.PAID);
        booking.setPaymentReference("MOCK_" + System.currentTimeMillis());
        
        if (booking.getBookingStatus() == BookingStatus.PENDING) {
            booking.setBookingStatus(BookingStatus.CONFIRMED);
        }
        
        bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public void cancelBooking(String userEmail, Long bookingId) {
        Booking booking = bookingRepository.findByIdWithUserAndCourt(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        assertCanCancel(userEmail, booking);

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new BusinessException("Booking is already cancelled");
        }

        if (booking.getBookingStatus() == BookingStatus.COMPLETED) {
            throw new BusinessException("Completed booking cannot be cancelled");
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        if (booking.getPaymentStatus() == PaymentStatus.PAID) {
            booking.setPaymentStatus(PaymentStatus.REFUNDED);
        }
        bookingRepository.save(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<BookingResponse> getMyBookings(String userEmail, int page, Integer size) {
        User user = findActiveUser(userEmail);
        Pageable pageable = PageableUtils.create(page, size, paginationProperties);
        Page<Booking> bookingPage = bookingRepository.findByUser_IdOrderByBookingDateDescStartTimeDesc(
                user.getId(), pageable
        );
        return PageResponse.from(bookingPage.map(bookingMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public CourtScheduleResponse getCourtSchedule(Long courtId, LocalDate bookingDate) {
        if (bookingDate == null) {
            throw new BusinessException("Booking date is required");
        }

        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found"));

        List<Booking> bookings = bookingRepository.findByCourt_IdAndBookingDateAndBookingStatusInOrderByStartTimeAsc(
                courtId,
                bookingDate,
                BookingStatusGroups.COURT_SCHEDULE_STATUSES
        );

        List<CourtScheduleSlotResponse> slots = bookings.stream()
                .map(bookingMapper::toScheduleSlot)
                .toList();

        return CourtScheduleResponse.builder()
                .courtId(court.getId())
                .courtName(court.getName())
                .bookingDate(bookingDate)
                .slots(slots)
                .build();
    }

    private User findActiveUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BusinessException("Account is inactive");
        }
        return user;
    }

    private Court findBookableCourt(Long courtId) {
        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found"));
        if (court.getStatus() != CourtStatus.ACTIVE) {
            throw new BusinessException("Court is not available for booking");
        }
        return court;
    }

    private void assertCanCancel(String userEmail, Booking booking) {
        boolean isOwner = booking.getUser().getEmail().equals(userEmail);
        if (!isOwner && !SecurityUtils.isAdmin()) {
            throw new BusinessException("You are not allowed to cancel this booking");
        }
    }
}
