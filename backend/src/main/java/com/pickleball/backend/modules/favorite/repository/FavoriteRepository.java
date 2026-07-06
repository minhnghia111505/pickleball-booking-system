package com.pickleball.backend.modules.favorite.repository;

import com.pickleball.backend.modules.court.entity.Court;
import com.pickleball.backend.modules.favorite.entity.Favorite;
import com.pickleball.backend.modules.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserOrderByCreatedAtDesc(User user);

    Optional<Favorite> findByUserAndCourt(User user, Court court);

    boolean existsByUserAndCourt(User user, Court court);

    void deleteByUserAndCourt(User user, Court court);
}
