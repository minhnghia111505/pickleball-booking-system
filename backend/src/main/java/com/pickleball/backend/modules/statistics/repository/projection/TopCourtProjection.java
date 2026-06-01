package com.pickleball.backend.modules.statistics.repository.projection;

public interface TopCourtProjection {

    Long getCourtId();

    String getCourtName();

    Long getBookingCount();
}
