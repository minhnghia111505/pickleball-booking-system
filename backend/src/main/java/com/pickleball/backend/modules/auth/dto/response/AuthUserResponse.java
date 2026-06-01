package com.pickleball.backend.modules.auth.dto.response;

import com.pickleball.backend.modules.user.entity.UserRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthUserResponse {

    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private UserRole role;
}
