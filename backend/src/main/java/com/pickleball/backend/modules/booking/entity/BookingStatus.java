package com.pickleball.backend.modules.booking.entity;

public enum BookingStatus {
    /** Reserved for payment flow; booking is not yet confirmed. */
    PENDING,
    CONFIRMED,
    CANCELLED,
    COMPLETED
}
