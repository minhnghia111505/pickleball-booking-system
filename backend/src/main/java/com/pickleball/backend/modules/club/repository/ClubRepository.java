package com.pickleball.backend.modules.club.repository;

import com.pickleball.backend.modules.club.entity.Club;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    Page<Club> findByNameContainingIgnoreCaseOrAddressContainingIgnoreCase(String name, String address, Pageable pageable);
}
