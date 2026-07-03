package com.pickleball.backend.modules.schedule.repository;

import com.pickleball.backend.modules.schedule.entity.ScheduleLock;
import com.pickleball.backend.modules.schedule.repository.projection.ScheduleLockProjection;
import com.pickleball.backend.persistence.EntityGraphNames;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ScheduleLockRepository extends JpaRepository<ScheduleLock, Long> {

    org.springframework.data.domain.Page<ScheduleLock> findByCourtId(Long courtId, org.springframework.data.domain.Pageable pageable);

    @EntityGraph(EntityGraphNames.SCHEDULE_LOCK_WITH_COURT)
    @Query("SELECT sl FROM ScheduleLock sl WHERE sl.id = :id")
    Optional<ScheduleLock> findByIdWithCourt(@Param("id") Long id);

    @Query("""
            SELECT sl.id AS id,
                   sl.lockDate AS lockDate,
                   sl.startTime AS startTime,
                   sl.endTime AS endTime,
                   sl.reason AS reason
            FROM ScheduleLock sl
            WHERE sl.court.id = :courtId
              AND sl.lockDate = :lockDate
            ORDER BY sl.startTime ASC
            """)
    List<ScheduleLockProjection> findProjectionsByCourtAndDate(
            @Param("courtId") Long courtId,
            @Param("lockDate") LocalDate lockDate
    );

    @Query("""
            SELECT sl.id AS id,
                   sl.lockDate AS lockDate,
                   sl.startTime AS startTime,
                   sl.endTime AS endTime,
                   sl.reason AS reason
            FROM ScheduleLock sl
            WHERE sl.court.id = :courtId
              AND sl.lockDate BETWEEN :startDate AND :endDate
            ORDER BY sl.lockDate ASC, sl.startTime ASC
            """)
    List<ScheduleLockProjection> findProjectionsByCourtAndDateRange(
            @Param("courtId") Long courtId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("""
            SELECT CASE WHEN COUNT(sl) > 0 THEN true ELSE false END
            FROM ScheduleLock sl
            WHERE sl.court.id = :courtId
              AND sl.lockDate = :lockDate
              AND sl.startTime < :endTime
              AND sl.endTime > :startTime
            """)
    boolean existsOverlappingLock(
            @Param("courtId") Long courtId,
            @Param("lockDate") LocalDate lockDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    @Query("""
            SELECT CASE WHEN COUNT(sl) > 0 THEN true ELSE false END
            FROM ScheduleLock sl
            WHERE sl.court.id = :courtId
              AND sl.lockDate = :lockDate
              AND sl.startTime < :endTime
              AND sl.endTime > :startTime
              AND sl.id <> :excludeLockId
            """)
    boolean existsOverlappingLockExcludingId(
            @Param("courtId") Long courtId,
            @Param("lockDate") LocalDate lockDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("excludeLockId") Long excludeLockId
    );
}
