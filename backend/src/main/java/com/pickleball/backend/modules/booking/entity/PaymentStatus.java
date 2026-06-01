package com.pickleball.backend.modules.booking.entity;

/**
 * Payment lifecycle; used when payment module is integrated.
 */
public enum PaymentStatus {
    UNPAID,
    PAID,
    REFUNDED
}
