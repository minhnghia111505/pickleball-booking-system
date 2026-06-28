package com.pickleball.backend.modules.club.mapper;

import com.pickleball.backend.modules.club.dto.response.ClubResponse;
import com.pickleball.backend.modules.club.entity.Club;

public class ClubMapper {
    public static ClubResponse toResponse(Club club) {
        return ClubResponse.builder()
                .id(club.getId())
                .name(club.getName())
                .address(club.getAddress())
                .phone(club.getPhone())
                .email(club.getEmail())
                .description(club.getDescription())
                .logoUrl(club.getLogoUrl())
                .status(club.getStatus())
                .build();
    }
}
