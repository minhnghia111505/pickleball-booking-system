package com.pickleball.backend.modules.club.dto.request.settings;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateClubSettingsRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Phone is required")
    private String phone;

    private String email;
    private String description;
    private String logoUrl;
    
    @jakarta.validation.constraints.NotNull(message = "Opening time is required")
    private java.time.LocalTime openTime;
    
    @jakarta.validation.constraints.NotNull(message = "Closing time is required")
    private java.time.LocalTime closeTime;
}
