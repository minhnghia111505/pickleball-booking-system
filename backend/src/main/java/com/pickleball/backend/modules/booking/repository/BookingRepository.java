package com.pickleball.backend.modules.booking.repository;

import com.pickleball.backend.modules.booking.entity.Booking;
import com.pickleball.backend.modules.booking.entity.BookingStatus;
import com.pickleball.backend.modules.schedule.repository.projection.ScheduleBookingProjection;
import com.pickleball.backend.persistence.EntityGraphNames;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    /**
     * Pessimistic lock for overlap checks; only booking columns are used — no entity graph.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT b FROM Booking b
            WHERE b.court.id = :courtId
              AND b.bookingDate = :bookingDate
              AND b.bookingStatus IN :activeStatuses
            """)
    List<Booking> findActiveBookingsForCourtAndDateWithLock(
            @Param("courtId") Long courtId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("activeStatuses") Collection<BookingStatus> activeStatuses
    );

    @Query("""
            SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END
            FROM Booking b
            WHERE b.court.id = :courtId
              AND b.bookingDate = :bookingDate
              AND b.bookingStatus IN :activeStatuses
              AND b.startTime < :endTime
              AND b.endTime > :startTime
            """)
    boolean existsOverlappingBooking(
            @Param("courtId") Long courtId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("activeStatuses") Collection<BookingStatus> activeStatuses
    );

    @EntityGraph(EntityGraphNames.BOOKING_WITH_DETAILS)
    Page<Booking> findByUser_IdOrderByBookingDateDescStartTimeDesc(Long userId, Pageable pageable);

    @EntityGraph(EntityGraphNames.BOOKING_WITH_DETAILS)
    Page<Booking> findByClub_IdOrderByBookingDateDescStartTimeDesc(Long clubId, Pageable pageable);

    /**
     * Scalar fields only — safe without fetch join (see {@code BookingMapper#toScheduleSlot}).
     */
    List<Booking> findByCourt_IdAndBookingDateAndBookingStatusInOrderByStartTimeAsc(
            Long courtId,
            LocalDate bookingDate,
            Collection<BookingStatus> statuses
    );

    @EntityGraph(EntityGraphNames.BOOKING_WITH_DETAILS)
    @Query("SELECT b FROM Booking b WHERE b.id = :id")
    Optional<Booking> findByIdWithUserAndCourt(@Param("id") Long id);

    @Query("""
            SELECT b.id AS id,
                   b.bookingDate AS bookingDate,
                   b.startTime AS startTime,
                   b.endTime AS endTime,
                   b.bookingStatus AS bookingStatus
            FROM Booking b
            WHERE b.court.id = :courtId
              AND b.bookingDate = :bookingDate
              AND b.bookingStatus IN :statuses
            ORDER BY b.startTime ASC
            """)
    List<ScheduleBookingProjection> findScheduleProjectionsByCourtAndDate(
            @Param("courtId") Long courtId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("statuses") Collection<BookingStatus> statuses
    );

    @Query("""
            SELECT b.id AS id,
                   b.bookingDate AS bookingDate,
                   b.startTime AS startTime,
                   b.endTime AS endTime,
                   b.bookingStatus AS bookingStatus
            FROM Booking b
            WHERE b.court.id = :courtId
              AND b.bookingDate BETWEEN :startDate AND :endDate
              AND b.bookingStatus IN :statuses
            ORDER BY b.bookingDate ASC, b.startTime ASC
            """)
    List<ScheduleBookingProjection> findScheduleProjectionsByCourtAndDateRange(
            @Param("courtId") Long courtId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("statuses") Collection<BookingStatus> statuses
    );
}
