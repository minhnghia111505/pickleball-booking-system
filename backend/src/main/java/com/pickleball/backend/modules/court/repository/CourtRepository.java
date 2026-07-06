package com.pickleball.backend.modules.court.repository;

import com.pickleball.backend.modules.court.entity.Court;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourtRepository extends JpaRepository<Court, Long> {

    Page<Court> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Court> findByClubId(Long clubId, Pageable pageable);
    Page<Court> findByClubIdAndNameContainingIgnoreCase(Long clubId, String name, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT c FROM Court c WHERE (:clubId IS NULL OR c.club.id = :clubId) " +
           "AND (:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:minPrice IS NULL OR c.pricePerHour >= :minPrice) " +
           "AND (:maxPrice IS NULL OR c.pricePerHour <= :maxPrice) " +
           "AND (:minLat IS NULL OR c.club.latitude >= :minLat) " +
           "AND (:maxLat IS NULL OR c.club.latitude <= :maxLat) " +
           "AND (:minLng IS NULL OR c.club.longitude >= :minLng) " +
           "AND (:maxLng IS NULL OR c.club.longitude <= :maxLng) " +
           "AND (:province IS NULL OR LOWER(c.club.address) LIKE LOWER(CONCAT('%', :province, '%'))) " +
           "AND (:district IS NULL OR LOWER(c.club.address) LIKE LOWER(CONCAT('%', :district, '%'))) " +
           "AND (:bookingDate IS NULL OR :startTime IS NULL OR :endTime IS NULL OR " +
           "  NOT EXISTS (SELECT 1 FROM Booking b WHERE b.court.id = c.id " +
           "    AND b.bookingDate = :bookingDate " +
           "    AND b.startTime < :endTime " +
           "    AND b.endTime > :startTime " +
           "    AND b.bookingStatus IN ('CONFIRMED', 'PENDING')))")
    Page<Court> findCourtsWithAdvancedFilters(
            @org.springframework.data.repository.query.Param("clubId") Long clubId, 
            @org.springframework.data.repository.query.Param("search") String search, 
            @org.springframework.data.repository.query.Param("minPrice") java.math.BigDecimal minPrice, 
            @org.springframework.data.repository.query.Param("maxPrice") java.math.BigDecimal maxPrice, 
            @org.springframework.data.repository.query.Param("minLat") Double minLat,
            @org.springframework.data.repository.query.Param("maxLat") Double maxLat,
            @org.springframework.data.repository.query.Param("minLng") Double minLng,
            @org.springframework.data.repository.query.Param("maxLng") Double maxLng,
            @org.springframework.data.repository.query.Param("bookingDate") java.time.LocalDate bookingDate,
            @org.springframework.data.repository.query.Param("startTime") java.time.LocalTime startTime,
            @org.springframework.data.repository.query.Param("endTime") java.time.LocalTime endTime,
            @org.springframework.data.repository.query.Param("province") String province,
            @org.springframework.data.repository.query.Param("district") String district,
            Pageable pageable);
}
