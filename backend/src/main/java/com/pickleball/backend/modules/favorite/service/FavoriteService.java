package com.pickleball.backend.modules.favorite.service;

import com.pickleball.backend.modules.court.dto.response.CourtResponse;

import java.util.List;

public interface FavoriteService {
    
    List<CourtResponse> getMyFavorites(String email);

    void addFavorite(String email, Long courtId);

    void removeFavorite(String email, Long courtId);
}
