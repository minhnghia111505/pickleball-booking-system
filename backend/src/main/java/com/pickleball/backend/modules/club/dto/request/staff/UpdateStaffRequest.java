package com.pickleball.backend.modules.club.dto.request.staff;

import com.pickleball.backend.modules.user.entity.UserStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateStaffRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotNull(message = "Status is required")
    private UserStatus status;
}
