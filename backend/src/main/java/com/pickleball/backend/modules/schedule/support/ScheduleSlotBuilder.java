package com.pickleball.backend.modules.schedule.support;

import com.pickleball.backend.modules.schedule.dto.response.ScheduleEventResponse;
import com.pickleball.backend.modules.schedule.dto.response.ScheduleSlotResponse;
import com.pickleball.backend.modules.schedule.entity.ScheduleEventType;
import com.pickleball.backend.modules.schedule.entity.ScheduleSlotStatus;
import com.pickleball.backend.util.TimeIntervalUtils;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class ScheduleSlotBuilder {

    public List<ScheduleEventResponse> buildEvents(List<ScheduleBusyInterval> busyIntervals) {
        return busyIntervals.stream()
                .map(this::toEvent)
                .toList();
    }

    public List<ScheduleSlotResponse> buildSlots(
            LocalDate date,
            LocalTime openingTime,
            LocalTime closingTime,
            int slotDurationMinutes,
            int minBookableMinutes,
            List<ScheduleBusyInterval> busyIntervals
    ) {
        List<ScheduleSlotResponse> slots = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        LocalTime cursor = openingTime;
        while (cursor.plusMinutes(slotDurationMinutes).compareTo(closingTime) <= 0) {
            LocalTime slotEnd = cursor.plusMinutes(slotDurationMinutes);
            ScheduleSlotStatus status = resolveSlotStatus(date, cursor, slotEnd, busyIntervals, now, minBookableMinutes);
            slots.add(ScheduleSlotResponse.builder()
                    .startTime(cursor)
                    .endTime(slotEnd)
                    .status(status)
                    .build());
            cursor = slotEnd;
        }

        return slots;
    }

    public List<ScheduleSlotResponse> filterAvailable(List<ScheduleSlotResponse> slots) {
        return slots.stream()
                .filter(slot -> slot.getStatus() == ScheduleSlotStatus.AVAILABLE)
                .toList();
    }

    private ScheduleEventResponse toEvent(ScheduleBusyInterval interval) {
        ScheduleEventType eventType = interval.type() == ScheduleBusyType.BOOKING
                ? ScheduleEventType.BOOKING
                : ScheduleEventType.MAINTENANCE_LOCK;

        return ScheduleEventResponse.builder()
                .id(interval.sourceId())
                .type(eventType)
                .startTime(interval.startTime())
                .endTime(interval.endTime())
                .title(interval.label())
                .build();
    }

    private ScheduleSlotStatus resolveSlotStatus(
            LocalDate date,
            LocalTime slotStart,
            LocalTime slotEnd,
            List<ScheduleBusyInterval> busyIntervals,
            LocalDateTime now,
            int minBookableMinutes
    ) {
        if (date.isBefore(now.toLocalDate())) {
            return ScheduleSlotStatus.PAST;
        }

        if (date.isEqual(now.toLocalDate())) {
            LocalDateTime slotStartDateTime = LocalDateTime.of(date, slotStart);
            if (!slotStartDateTime.isAfter(now)) {
                return ScheduleSlotStatus.PAST;
            }
        }

        long slotMinutes = java.time.Duration.between(slotStart, slotEnd).toMinutes();
        if (slotMinutes < minBookableMinutes) {
            return ScheduleSlotStatus.UNAVAILABLE;
        }

        for (ScheduleBusyInterval busy : busyIntervals) {
            if (TimeIntervalUtils.overlaps(slotStart, slotEnd, busy.startTime(), busy.endTime())) {
                return busy.type() == ScheduleBusyType.MAINTENANCE_LOCK
                        ? ScheduleSlotStatus.LOCKED
                        : ScheduleSlotStatus.BOOKED;
            }
        }

        return ScheduleSlotStatus.AVAILABLE;
    }
}
