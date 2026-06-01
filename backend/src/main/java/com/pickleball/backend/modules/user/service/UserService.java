package com.pickleball.backend.modules.user.service;

import com.pickleball.backend.modules.user.dto.request.ChangePasswordRequest;
import com.pickleball.backend.modules.user.dto.request.UpdateProfileRequest;
import com.pickleball.backend.modules.user.dto.response.UserProfileResponse;

public interface UserService {

    UserProfileResponse getProfile(String email);

    UserProfileResponse updateProfile(String email, UpdateProfileRequest request);

    void changePassword(String email, ChangePasswordRequest request);
}
