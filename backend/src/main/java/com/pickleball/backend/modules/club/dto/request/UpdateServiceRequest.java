package com.pickleball.backend.modules.club.dto.request;

import com.pickleball.backend.modules.club.entity.ServiceStatus;
import com.pickleball.backend.modules.club.entity.ServiceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateServiceRequest {

    @NotBlank(message = "Service name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price must be non-negative")
    private BigDecimal price;
    
    private String icon;

    @NotNull(message = "Type is required")
    private ServiceType type;
    
    @NotNull(message = "Status is required")
    private ServiceStatus status;
}
