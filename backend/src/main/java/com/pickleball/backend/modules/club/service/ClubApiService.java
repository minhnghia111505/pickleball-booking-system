package com.pickleball.backend.modules.club.service;

import com.pickleball.backend.modules.club.dto.response.ClubResponse;
import com.pickleball.backend.modules.club.dto.response.ServiceResponse;
import com.pickleball.backend.response.PageResponse;

import java.util.List;

public interface ClubApiService {
    PageResponse<ClubResponse> getClubs(String search, int page, Integer size);
    ClubResponse getClubById(Long id);
    List<ServiceResponse> getServicesByClubId(Long clubId);
}
