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
           "AND (:maxPrice IS NULL OR c.pricePerHour <= :maxPrice)")
    Page<Court> findCourtsWithFilters(
            @org.springframework.data.repository.query.Param("clubId") Long clubId, 
            @org.springframework.data.repository.query.Param("search") String search, 
            @org.springframework.data.repository.query.Param("minPrice") java.math.BigDecimal minPrice, 
            @org.springframework.data.repository.query.Param("maxPrice") java.math.BigDecimal maxPrice, 
            Pageable pageable);
}
