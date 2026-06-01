package com.pickleball.backend.modules.schedule.mapper;

import com.pickleball.backend.modules.court.entity.Court;
import com.pickleball.backend.modules.schedule.dto.response.ScheduleLockResponse;
import com.pickleball.backend.modules.schedule.entity.ScheduleLock;
import org.springframework.stereotype.Component;

@Component
public class ScheduleLockMapper {

    public ScheduleLockResponse toResponse(ScheduleLock lock, Court court) {
        return ScheduleLockResponse.builder()
                .id(lock.getId())
                .courtId(court.getId())
                .courtName(court.getName())
                .lockDate(lock.getLockDate())
                .startTime(lock.getStartTime())
                .endTime(lock.getEndTime())
                .lockType(lock.getLockType())
                .reason(lock.getReason())
                .createdAt(lock.getCreatedAt())
                .build();
    }

    /**
     * Requires {@code court} initialized (entity graph or fetch join).
     */
    public ScheduleLockResponse toResponse(ScheduleLock lock) {
        return toResponse(lock, lock.getCourt());
    }
}
