package com.pickleball.backend.modules.booking.entity;

import com.pickleball.backend.entity.BaseEntity;
import com.pickleball.backend.modules.court.entity.Court;
import com.pickleball.backend.modules.user.entity.User;
import com.pickleball.backend.persistence.EntityGraphNames;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedAttributeNode;
import jakarta.persistence.NamedEntityGraph;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(
        name = "bookings",
        indexes = {
                @Index(
                        name = "idx_bookings_court_date_status",
                        columnList = "court_id, booking_date, booking_status"
                ),
                @Index(
                        name = "idx_bookings_user_date",
                        columnList = "user_id, booking_date"
                ),
                @Index(
                        name = "idx_bookings_date_status",
                        columnList = "booking_date, booking_status"
                )
        }
)
@NamedEntityGraph(
        name = EntityGraphNames.BOOKING_WITH_DETAILS,
        attributeNodes = {
                @NamedAttributeNode("user"),
                @NamedAttributeNode("court")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class Booking extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "court_id", nullable = false)
    private Court court;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status", nullable = false, length = 20)
    private BookingStatus bookingStatus;

    @Column(name = "total_amount", precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", length = 20)
    private PaymentStatus paymentStatus;

    @Column(name = "payment_reference", length = 255)
    private String paymentReference;

    @OneToMany(mappedBy = "booking", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
    private java.util.List<BookingServiceItem> services = new java.util.ArrayList<>();
}
