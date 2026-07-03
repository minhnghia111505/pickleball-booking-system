package com.pickleball.backend.modules.club.service;

import com.pickleball.backend.modules.club.dto.request.settings.UpdateClubSettingsRequest;
import com.pickleball.backend.modules.club.dto.response.ClubResponse;

public interface ManagerClubSettingsService {
    ClubResponse getClubSettings(String managerEmail);
    ClubResponse updateClubSettings(String managerEmail, UpdateClubSettingsRequest request);
}
