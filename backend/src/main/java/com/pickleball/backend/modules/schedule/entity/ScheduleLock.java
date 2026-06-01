package com.pickleball.backend.modules.schedule.entity;

import com.pickleball.backend.entity.BaseEntity;
import com.pickleball.backend.modules.court.entity.Court;
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
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(
        name = "schedule_locks",
        indexes = {
                @Index(
                        name = "idx_schedule_locks_court_date",
                        columnList = "court_id, lock_date"
                )
        }
)
@NamedEntityGraph(
        name = EntityGraphNames.SCHEDULE_LOCK_WITH_COURT,
        attributeNodes = @NamedAttributeNode("court")
)
@Getter
@Setter
@NoArgsConstructor
public class ScheduleLock extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "court_id", nullable = false)
    private Court court;

    @Column(name = "lock_date", nullable = false)
    private LocalDate lockDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "lock_type", nullable = false, length = 20)
    private ScheduleLockType lockType = ScheduleLockType.MAINTENANCE;

    @Column(length = 500)
    private String reason;
}
