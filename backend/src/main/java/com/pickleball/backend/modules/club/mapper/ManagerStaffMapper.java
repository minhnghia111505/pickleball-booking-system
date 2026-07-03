package com.pickleball.backend.modules.club.mapper;

import com.pickleball.backend.modules.club.dto.response.staff.StaffResponse;
import com.pickleball.backend.modules.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class ManagerStaffMapper {
    public StaffResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return StaffResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .status(user.getStatus())
                .avatarUrl(user.getAvatarUrl())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
