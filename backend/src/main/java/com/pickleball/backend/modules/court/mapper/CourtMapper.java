package com.pickleball.backend.modules.court.mapper;

import com.pickleball.backend.modules.court.dto.request.CreateCourtRequest;
import com.pickleball.backend.modules.court.dto.request.UpdateCourtRequest;
import com.pickleball.backend.modules.court.dto.response.CourtResponse;
import com.pickleball.backend.modules.court.entity.Court;
import com.pickleball.backend.modules.court.entity.CourtStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class CourtMapper {

    public Court toEntity(CreateCourtRequest request) {
        Court court = new Court();
        applyRequest(court, request.getName(), request.getAddress(), request.getDescription(),
                request.getPricePerHour(), request.getStatus(), request.getImageUrl());
        return court;
    }

    public void updateEntity(Court court, UpdateCourtRequest request) {
        applyRequest(court, request.getName(), request.getAddress(), request.getDescription(),
                request.getPricePerHour(), request.getStatus(), request.getImageUrl());
    }

    public CourtResponse toResponse(Court court) {
        com.pickleball.backend.modules.club.entity.Club club = court.getClub();
        return CourtResponse.builder()
                .id(court.getId())
                .name(court.getName())
                .address(court.getAddress())
                .description(court.getDescription())
                .pricePerHour(court.getPricePerHour())
                .status(court.getStatus())
                .imageUrl(court.getImageUrl())
                .clubId(club != null ? club.getId() : null)
                .clubName(club != null ? club.getName() : null)
                .latitude(club != null ? club.getLatitude() : null)
                .longitude(club != null ? club.getLongitude() : null)
                .rating(club != null ? club.getRating() : null)
                .reviewsCount(club != null ? club.getReviewsCount() : null)
                .googleMapUrl(club != null ? club.getGoogleMapUrl() : null)
                .createdAt(court.getCreatedAt())
                .updatedAt(court.getUpdatedAt())
                .build();
    }

    private void applyRequest(
            Court court,
            String name,
            String address,
            String description,
            BigDecimal pricePerHour,
            CourtStatus status,
            String imageUrl
    ) {
        court.setName(name);
        court.setAddress(address);
        court.setDescription(description);
        court.setPricePerHour(pricePerHour);
        court.setStatus(status);
        court.setImageUrl(imageUrl);
    }
}
