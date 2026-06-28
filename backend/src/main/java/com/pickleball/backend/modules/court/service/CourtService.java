package com.pickleball.backend.modules.court.service;

import com.pickleball.backend.modules.court.dto.request.CreateCourtRequest;
import com.pickleball.backend.modules.court.dto.request.UpdateCourtRequest;
import com.pickleball.backend.modules.court.dto.response.CourtResponse;
import com.pickleball.backend.response.PageResponse;

public interface CourtService {

    PageResponse<CourtResponse> getCourts(Long clubId, String search, int page, Integer size);

    CourtResponse getCourtById(Long id);

    CourtResponse createCourt(String userEmail, CreateCourtRequest request);

    CourtResponse updateCourt(String userEmail, Long id, UpdateCourtRequest request);

    void deleteCourt(Long id);
}
