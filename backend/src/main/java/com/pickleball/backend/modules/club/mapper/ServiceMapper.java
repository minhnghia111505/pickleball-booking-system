package com.pickleball.backend.modules.club.mapper;

import com.pickleball.backend.modules.club.dto.response.ServiceResponse;
import com.pickleball.backend.modules.club.entity.ClubService;

public class ServiceMapper {
    public static ServiceResponse toResponse(ClubService service) {
        return ServiceResponse.builder()
                .id(service.getId())
                .clubId(service.getClub().getId())
                .name(service.getName())
                .type(service.getType().name())
                .price(service.getPrice())
                .status(service.getStatus().name())
                .imageUrl(service.getImageUrl())
                .build();
    }
}
