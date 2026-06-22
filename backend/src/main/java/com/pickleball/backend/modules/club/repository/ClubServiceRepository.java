package com.pickleball.backend.modules.club.repository;

import com.pickleball.backend.modules.club.entity.ClubService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClubServiceRepository extends JpaRepository<ClubService, Long> {
    List<ClubService> findByClubIdAndStatus(Long clubId, com.pickleball.backend.modules.club.entity.ServiceStatus status);
}
