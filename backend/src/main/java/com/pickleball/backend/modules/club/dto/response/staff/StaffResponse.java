package com.pickleball.backend.modules.club.dto.response.staff;

import com.pickleball.backend.modules.user.entity.UserStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class StaffResponse {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private UserStatus status;
    private String avatarUrl;
    private LocalDateTime createdAt;
}
