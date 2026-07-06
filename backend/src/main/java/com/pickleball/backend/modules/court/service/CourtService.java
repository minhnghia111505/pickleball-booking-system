package com.pickleball.backend.modules.court.service;

import com.pickleball.backend.modules.court.dto.request.CreateCourtRequest;
import com.pickleball.backend.modules.court.dto.request.UpdateCourtRequest;
import com.pickleball.backend.modules.court.dto.response.CourtResponse;
import com.pickleball.backend.response.PageResponse;

public interface CourtService {

    PageResponse<CourtResponse> getCourts(
            Long clubId, String search, 
            java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice, 
            java.time.LocalDate date, java.time.LocalTime startTime, java.time.LocalTime endTime,
            Double userLat, Double userLng, Double radiusInKm,
            String province, String district,
            int page, Integer size, String sort);

    CourtResponse getCourtById(Long id);

    CourtResponse createCourt(String userEmail, CreateCourtRequest request);

    CourtResponse updateCourt(String userEmail, Long id, UpdateCourtRequest request);

    void deleteCourt(Long id);
}
