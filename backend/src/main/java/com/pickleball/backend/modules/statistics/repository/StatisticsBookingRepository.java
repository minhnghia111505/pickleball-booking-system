package com.pickleball.backend.modules.statistics.repository;

import com.pickleball.backend.modules.booking.entity.Booking;
import com.pickleball.backend.modules.booking.entity.BookingStatus;
import com.pickleball.backend.modules.statistics.repository.projection.BookingStatusCountProjection;
import com.pickleball.backend.modules.statistics.repository.projection.RevenueByDateProjection;
import com.pickleball.backend.modules.statistics.repository.projection.TopCourtProjection;
import com.pickleball.backend.modules.statistics.repository.projection.TopUserProjection;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

public interface StatisticsBookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
            SELECT COUNT(b)
            FROM Booking b
            WHERE b.bookingDate BETWEEN :startDate AND :endDate
            """)
    long countBookingsInPeriod(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("""
            SELECT b.bookingStatus AS bookingStatus, COUNT(b) AS count
            FROM Booking b
            WHERE b.bookingDate BETWEEN :startDate AND :endDate
            GROUP BY b.bookingStatus
            """)
    List<BookingStatusCountProjection> countBookingsGroupByStatus(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("""
            SELECT COALESCE(SUM(b.totalAmount), 0)
            FROM Booking b
            WHERE b.bookingDate BETWEEN :startDate AND :endDate
              AND b.bookingStatus IN :statuses
            """)
    BigDecimal sumRevenueInPeriod(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("statuses") Collection<BookingStatus> statuses
    );

    @Query("""
            SELECT b.bookingDate AS bookingDate, COALESCE(SUM(b.totalAmount), 0) AS amount
            FROM Booking b
            WHERE b.bookingDate BETWEEN :startDate AND :endDate
              AND b.bookingStatus IN :statuses
            GROUP BY b.bookingDate
            ORDER BY b.bookingDate ASC
            """)
    List<RevenueByDateProjection> sumRevenueGroupByDate(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("statuses") Collection<BookingStatus> statuses
    );

    @Query("""
            SELECT b.court.id AS courtId,
                   b.court.name AS courtName,
                   COUNT(b) AS bookingCount
            FROM Booking b
            WHERE b.bookingDate BETWEEN :startDate AND :endDate
              AND b.bookingStatus IN :statuses
            GROUP BY b.court.id, b.court.name
            ORDER BY COUNT(b) DESC
            """)
    List<TopCourtProjection> findTopCourtsByBookings(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("statuses") Collection<BookingStatus> statuses,
            Pageable pageable
    );

    @Query("""
            SELECT b.user.id AS userId,
                   b.user.fullName AS fullName,
                   b.user.email AS email,
                   COUNT(b) AS bookingCount
            FROM Booking b
            WHERE b.bookingDate BETWEEN :startDate AND :endDate
              AND b.bookingStatus IN :statuses
            GROUP BY b.user.id, b.user.fullName, b.user.email
            ORDER BY COUNT(b) DESC
            """)
    List<TopUserProjection> findTopUsersByBookings(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("statuses") Collection<BookingStatus> statuses,
            Pageable pageable
    );
}
