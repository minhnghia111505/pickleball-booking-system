package com.pickleball.backend.modules.statistics.repository.projection;

public interface TopUserProjection {

    Long getUserId();

    String getFullName();

    String getEmail();

    Long getBookingCount();
}
