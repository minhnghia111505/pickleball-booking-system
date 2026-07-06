package com.pickleball.backend.modules.favorite.controller;

import com.pickleball.backend.modules.court.dto.response.CourtResponse;
import com.pickleball.backend.modules.favorite.service.FavoriteService;
import com.pickleball.backend.response.ApiResponse;
import com.pickleball.backend.security.util.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourtResponse>>> getMyFavorites() {
        String email = SecurityUtils.getCurrentUserEmail();
        List<CourtResponse> favorites = favoriteService.getMyFavorites(email);
        return ResponseEntity.ok(ApiResponse.success("Favorites retrieved successfully", favorites));
    }

    @PostMapping("/{courtId}")
    public ResponseEntity<ApiResponse<Void>> addFavorite(@PathVariable Long courtId) {
        String email = SecurityUtils.getCurrentUserEmail();
        favoriteService.addFavorite(email, courtId);
        return ResponseEntity.ok(ApiResponse.success("Court added to favorites", null));
    }

    @DeleteMapping("/{courtId}")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(@PathVariable Long courtId) {
        String email = SecurityUtils.getCurrentUserEmail();
        favoriteService.removeFavorite(email, courtId);
        return ResponseEntity.ok(ApiResponse.success("Court removed from favorites", null));
    }
}
