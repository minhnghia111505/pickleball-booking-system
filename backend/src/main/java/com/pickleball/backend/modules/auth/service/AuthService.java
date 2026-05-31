package com.pickleball.backend.modules.auth.service;

import com.pickleball.backend.modules.auth.dto.request.LoginRequest;
import com.pickleball.backend.modules.auth.dto.request.RefreshTokenRequest;
import com.pickleball.backend.modules.auth.dto.request.RegisterRequest;
import com.pickleball.backend.modules.auth.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);
}
