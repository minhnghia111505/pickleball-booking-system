package com.pickleball.backend.modules.schedule.service.impl;

import com.pickleball.backend.config.BookingProperties;
import com.pickleball.backend.config.ScheduleProperties;
import com.pickleball.backend.exception.BusinessException;
import com.pickleball.backend.exception.ResourceNotFoundException;
import com.pickleball.backend.modules.court.entity.Court;
import com.pickleball.backend.modules.court.entity.CourtStatus;
import com.pickleball.backend.modules.court.repository.CourtRepository;
import com.pickleball.backend.modules.schedule.dto.request.CreateScheduleLockRequest;
import com.pickleball.backend.modules.schedule.dto.response.AvailableSlotsResponse;
import com.pickleball.backend.modules.schedule.dto.response.DailyScheduleResponse;
import com.pickleball.backend.modules.schedule.dto.response.ScheduleEventResponse;
import com.pickleball.backend.modules.schedule.dto.response.ScheduleLockResponse;
import com.pickleball.backend.modules.schedule.dto.response.ScheduleSlotResponse;
import com.pickleball.backend.modules.schedule.dto.response.WeeklyDayScheduleResponse;
import com.pickleball.backend.modules.schedule.dto.response.WeeklyScheduleResponse;
import com.pickleball.backend.modules.schedule.entity.ScheduleLock;
import com.pickleball.backend.modules.schedule.entity.ScheduleLockType;
import com.pickleball.backend.modules.schedule.entity.ScheduleSlotStatus;
import com.pickleball.backend.modules.schedule.mapper.ScheduleLockMapper;
import com.pickleball.backend.modules.schedule.repository.ScheduleLockRepository;
import com.pickleball.backend.modules.schedule.repository.projection.ScheduleBookingProjection;
import com.pickleball.backend.modules.schedule.repository.projection.ScheduleLockProjection;
import com.pickleball.backend.modules.schedule.service.ScheduleService;
import com.pickleball.backend.modules.schedule.support.ScheduleBusyInterval;
import com.pickleball.backend.modules.schedule.support.ScheduleDataLoader;
import com.pickleball.backend.modules.schedule.support.ScheduleIntervalMapper;
import com.pickleball.backend.modules.schedule.support.ScheduleLockValidator;
import com.pickleball.backend.modules.schedule.support.ScheduleSlotBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    private final CourtRepository courtRepository;
    private final ScheduleLockRepository scheduleLockRepository;
    private final ScheduleDataLoader scheduleDataLoader;
    private final ScheduleIntervalMapper scheduleIntervalMapper;
    private final ScheduleSlotBuilder scheduleSlotBuilder;
    private final ScheduleLockValidator scheduleLockValidator;
    private final ScheduleLockMapper scheduleLockMapper;
    private final BookingProperties bookingProperties;
    private final ScheduleProperties scheduleProperties;

    public ScheduleServiceImpl(
            CourtRepository courtRepository,
            ScheduleLockRepository scheduleLockRepository,
            ScheduleDataLoader scheduleDataLoader,
            ScheduleIntervalMapper scheduleIntervalMapper,
            ScheduleSlotBuilder scheduleSlotBuilder,
            ScheduleLockValidator scheduleLockValidator,
            ScheduleLockMapper scheduleLockMapper,
            BookingProperties bookingProperties,
            ScheduleProperties scheduleProperties
    ) {
        this.courtRepository = courtRepository;
        this.scheduleLockRepository = scheduleLockRepository;
        this.scheduleDataLoader = scheduleDataLoader;
        this.scheduleIntervalMapper = scheduleIntervalMapper;
        this.scheduleSlotBuilder = scheduleSlotBuilder;
        this.scheduleLockValidator = scheduleLockValidator;
        this.scheduleLockMapper = scheduleLockMapper;
        this.bookingProperties = bookingProperties;
        this.scheduleProperties = scheduleProperties;
    }

    @Override
    @Transactional(readOnly = true)
    public DailyScheduleResponse getDailySchedule(Long courtId, LocalDate date) {
        Court court = findCourt(courtId);
        validateDate(date);

        ScheduleDataLoader.ScheduleDayData dayData = scheduleDataLoader.loadDay(courtId, date);
        List<ScheduleBusyInterval> busyIntervals = scheduleIntervalMapper.toBusyIntervals(
                dayData.bookings(), dayData.locks()
        );

        List<ScheduleEventResponse> events = scheduleSlotBuilder.buildEvents(busyIntervals);
        List<ScheduleSlotResponse> slots = buildSlotsForDay(court, date, busyIntervals);

        return DailyScheduleResponse.builder()
                .courtId(court.getId())
                .courtName(court.getName())
                .courtStatus(court.getStatus())
                .date(date)
                .openingTime(bookingProperties.openingTime())
                .closingTime(bookingProperties.closingTime())
                .slotDurationMinutes(scheduleProperties.slotDurationMinutes())
                .events(events)
                .slots(slots)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AvailableSlotsResponse getAvailableSlots(Long courtId, LocalDate date) {
        Court court = findCourt(courtId);
        validateDate(date);

        ScheduleDataLoader.ScheduleDayData dayData = scheduleDataLoader.loadDay(courtId, date);
        List<ScheduleBusyInterval> busyIntervals = scheduleIntervalMapper.toBusyIntervals(
                dayData.bookings(), dayData.locks()
        );

        List<ScheduleSlotResponse> allSlots = buildSlotsForDay(court, date, busyIntervals);
        List<ScheduleSlotResponse> availableSlots = scheduleSlotBuilder.filterAvailable(allSlots);

        return AvailableSlotsResponse.builder()
                .courtId(court.getId())
                .courtName(court.getName())
                .date(date)
                .openingTime(bookingProperties.openingTime())
                .closingTime(bookingProperties.closingTime())
                .slotDurationMinutes(scheduleProperties.slotDurationMinutes())
                .availableSlots(availableSlots)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public WeeklyScheduleResponse getWeeklySchedule(Long courtId, LocalDate startDate) {
        Court court = findCourt(courtId);
        validateDate(startDate);

        LocalDate endDate = startDate.plusDays(scheduleProperties.weeklyDays() - 1L);
        ScheduleDataLoader.ScheduleRangeData rangeData = scheduleDataLoader.loadRange(courtId, startDate, endDate);

        Map<LocalDate, List<ScheduleBookingProjection>> bookingsByDate = rangeData.bookings().stream()
                .collect(Collectors.groupingBy(ScheduleBookingProjection::getBookingDate));

        Map<LocalDate, List<ScheduleLockProjection>> locksByDate = rangeData.locks().stream()
                .collect(Collectors.groupingBy(ScheduleLockProjection::getLockDate));

        List<WeeklyDayScheduleResponse> days = new ArrayList<>();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            List<ScheduleBookingProjection> dayBookings = bookingsByDate.getOrDefault(date, List.of());
            List<ScheduleLockProjection> dayLocks = locksByDate.getOrDefault(date, List.of());

            List<ScheduleBusyInterval> busyIntervals = scheduleIntervalMapper.toBusyIntervals(dayBookings, dayLocks);
            List<ScheduleEventResponse> events = scheduleSlotBuilder.buildEvents(busyIntervals);
            List<ScheduleSlotResponse> slots = buildSlotsForDay(court, date, busyIntervals);
            int availableCount = (int) slots.stream()
                    .filter(slot -> slot.getStatus() == ScheduleSlotStatus.AVAILABLE)
                    .count();

            days.add(WeeklyDayScheduleResponse.builder()
                    .date(date)
                    .events(events)
                    .slots(slots)
                    .availableSlotCount(availableCount)
                    .build());
        }

        return WeeklyScheduleResponse.builder()
                .courtId(court.getId())
                .courtName(court.getName())
                .startDate(startDate)
                .endDate(endDate)
                .openingTime(bookingProperties.openingTime())
                .closingTime(bookingProperties.closingTime())
                .slotDurationMinutes(scheduleProperties.slotDurationMinutes())
                .days(days)
                .build();
    }

    @Override
    @Transactional
    public ScheduleLockResponse createMaintenanceLock(CreateScheduleLockRequest request) {
        Court court = findCourt(request.getCourtId());

        scheduleLockValidator.validateLockWindow(
                request.getLockDate(), request.getStartTime(), request.getEndTime()
        );
        scheduleLockValidator.assertNoConflicts(
                court.getId(), request.getLockDate(), request.getStartTime(), request.getEndTime()
        );

        ScheduleLock lock = new ScheduleLock();
        lock.setCourt(court);
        lock.setLockDate(request.getLockDate());
        lock.setStartTime(request.getStartTime());
        lock.setEndTime(request.getEndTime());
        lock.setLockType(ScheduleLockType.MAINTENANCE);
        lock.setReason(request.getReason());

        ScheduleLock saved = scheduleLockRepository.save(lock);
        return scheduleLockMapper.toResponse(saved, court);
    }

    @Override
    @Transactional
    public void deleteMaintenanceLock(Long lockId) {
        ScheduleLock lock = scheduleLockRepository.findById(lockId)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule lock not found"));
        scheduleLockRepository.delete(lock);
    }

    private List<ScheduleSlotResponse> buildSlotsForDay(
            Court court,
            LocalDate date,
            List<ScheduleBusyInterval> busyIntervals
    ) {
        List<ScheduleSlotResponse> slots = scheduleSlotBuilder.buildSlots(
                date,
                bookingProperties.openingTime(),
                bookingProperties.closingTime(),
                scheduleProperties.slotDurationMinutes(),
                bookingProperties.minDurationMinutes(),
                busyIntervals
        );

        if (court.getStatus() != CourtStatus.ACTIVE) {
            return slots.stream()
                    .map(slot -> ScheduleSlotResponse.builder()
                            .startTime(slot.getStartTime())
                            .endTime(slot.getEndTime())
                            .status(ScheduleSlotStatus.UNAVAILABLE)
                            .build())
                    .toList();
        }

        return slots;
    }

    private Court findCourt(Long courtId) {
        return courtRepository.findById(courtId)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found"));
    }

    private void validateDate(LocalDate date) {
        if (date == null) {
            throw new BusinessException("Date is required");
        }
    }
}
