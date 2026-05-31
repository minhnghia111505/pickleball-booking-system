package com.pickleball.backend.modules.auth.service.impl;

import com.pickleball.backend.exception.BusinessException;
import com.pickleball.backend.exception.DuplicateResourceException;
import com.pickleball.backend.exception.UnauthorizedException;
import com.pickleball.backend.modules.auth.dto.request.LoginRequest;
import com.pickleball.backend.modules.auth.dto.request.RefreshTokenRequest;
import com.pickleball.backend.modules.auth.dto.request.RegisterRequest;
import com.pickleball.backend.modules.auth.dto.response.AuthResponse;
import com.pickleball.backend.modules.auth.mapper.AuthMapper;
import com.pickleball.backend.modules.auth.service.AuthService;
import com.pickleball.backend.modules.user.entity.User;
import com.pickleball.backend.modules.user.entity.UserRole;
import com.pickleball.backend.modules.user.entity.UserStatus;
import com.pickleball.backend.modules.user.repository.UserRepository;
import com.pickleball.backend.security.jwt.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private static final String TOKEN_TYPE_BEARER = "Bearer";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthMapper authMapper;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthMapper authMapper
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authMapper = authMapper;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setRole(UserRole.USER);
        user.setStatus(UserStatus.ACTIVE);

        User savedUser = userRepository.save(user);
        return buildAuthResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        validateActiveUser(user);
        return buildAuthResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        String email;

        try {
            email = jwtService.extractSubject(refreshToken);
        } catch (Exception ex) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (!jwtService.isRefreshTokenValid(refreshToken, user.getEmail())) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        validateActiveUser(user);
        return buildAuthResponse(user);
    }

    private void validateActiveUser(User user) {
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BusinessException("Account is inactive");
        }
    }

    private AuthResponse buildAuthResponse(User user) {
        String role = user.getRole().name();
        String accessToken = jwtService.generateAccessToken(user.getEmail(), role);
        String refreshToken = jwtService.generateRefreshToken(user.getEmail(), role);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType(TOKEN_TYPE_BEARER)
                .expiresIn(jwtService.getAccessTokenExpirationSeconds())
                .user(authMapper.toAuthUserResponse(user))
                .build();
    }
}
