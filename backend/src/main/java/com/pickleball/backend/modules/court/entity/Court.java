package com.pickleball.backend.modules.court.entity;

import com.pickleball.backend.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(
        name = "courts",
        indexes = {
                @Index(name = "idx_courts_name", columnList = "name"),
                @Index(name = "idx_courts_status", columnList = "status")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class Court extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 500)
    private String address;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "price_per_hour", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerHour;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CourtStatus status;

    @Column(name = "image_url", length = 512)
    private String imageUrl;
}
