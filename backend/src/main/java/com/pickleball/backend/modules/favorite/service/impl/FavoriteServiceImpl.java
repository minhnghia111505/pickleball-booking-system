package com.pickleball.backend.modules.favorite.service.impl;

import com.pickleball.backend.exception.BusinessException;
import com.pickleball.backend.exception.ResourceNotFoundException;
import com.pickleball.backend.modules.court.dto.response.CourtResponse;
import com.pickleball.backend.modules.court.entity.Court;
import com.pickleball.backend.modules.court.mapper.CourtMapper;
import com.pickleball.backend.modules.court.repository.CourtRepository;
import com.pickleball.backend.modules.favorite.entity.Favorite;
import com.pickleball.backend.modules.favorite.repository.FavoriteRepository;
import com.pickleball.backend.modules.favorite.service.FavoriteService;
import com.pickleball.backend.modules.user.entity.User;
import com.pickleball.backend.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final CourtRepository courtRepository;
    private final CourtMapper courtMapper;

    public FavoriteServiceImpl(FavoriteRepository favoriteRepository, 
                               UserRepository userRepository, 
                               CourtRepository courtRepository, 
                               CourtMapper courtMapper) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.courtRepository = courtRepository;
        this.courtMapper = courtMapper;
    }

    private User findActiveUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getStatus() != com.pickleball.backend.modules.user.entity.UserStatus.ACTIVE) {
            throw new BusinessException("Account is inactive");
        }

        return user;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourtResponse> getMyFavorites(String email) {
        User user = findActiveUserByEmail(email);
        List<Favorite> favorites = favoriteRepository.findByUserOrderByCreatedAtDesc(user);
        
        return favorites.stream()
                .map(favorite -> courtMapper.toResponse(favorite.getCourt()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void addFavorite(String email, Long courtId) {
        User user = findActiveUserByEmail(email);
        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found"));

        if (favoriteRepository.existsByUserAndCourt(user, court)) {
            // Already favorited, ignore or throw error
            return;
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .court(court)
                .build();
        
        favoriteRepository.save(favorite);
    }

    @Override
    @Transactional
    public void removeFavorite(String email, Long courtId) {
        User user = findActiveUserByEmail(email);
        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found"));

        favoriteRepository.deleteByUserAndCourt(user, court);
    }
}
