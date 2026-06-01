package com.pickleball.backend.modules.court.repository;

import com.pickleball.backend.modules.court.entity.Court;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourtRepository extends JpaRepository<Court, Long> {

    Page<Court> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
