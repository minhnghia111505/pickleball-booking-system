package com.pickleball.backend.modules.court.dto.request;

import com.pickleball.backend.modules.court.entity.CourtStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreateCourtRequest {

    @NotBlank(message = "Court name is required")
    @Size(max = 200, message = "Court name must not exceed 200 characters")
    private String name;

    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotNull(message = "Price per hour is required")
    @DecimalMin(value = "0.01", message = "Price per hour must be greater than 0")
    private BigDecimal pricePerHour;

    @NotNull(message = "Status is required")
    private CourtStatus status;

    @Size(max = 512, message = "Image URL must not exceed 512 characters")
    private String imageUrl;
}
