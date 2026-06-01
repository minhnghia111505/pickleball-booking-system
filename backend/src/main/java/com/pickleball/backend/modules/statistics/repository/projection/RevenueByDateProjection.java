package com.pickleball.backend.modules.statistics.repository.projection;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface RevenueByDateProjection {

    LocalDate getBookingDate();

    BigDecimal getAmount();
}
