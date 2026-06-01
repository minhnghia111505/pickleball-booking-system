package com.pickleball.backend.modules.schedule.repository.projection;

import java.time.LocalDate;
import java.time.LocalTime;

public interface ScheduleLockProjection {

    Long getId();

    LocalDate getLockDate();

    LocalTime getStartTime();

    LocalTime getEndTime();

    String getReason();
}
