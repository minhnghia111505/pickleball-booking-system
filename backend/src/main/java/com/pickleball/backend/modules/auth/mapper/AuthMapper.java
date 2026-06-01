package com.pickleball.backend.modules.auth.mapper;

import com.pickleball.backend.modules.auth.dto.response.AuthUserResponse;
import com.pickleball.backend.modules.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public AuthUserResponse toAuthUserResponse(User user) {
        return AuthUserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .build();
    }
}
