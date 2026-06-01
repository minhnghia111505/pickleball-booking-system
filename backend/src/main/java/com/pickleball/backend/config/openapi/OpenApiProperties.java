package com.pickleball.backend.config.openapi;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.openapi")
public record OpenApiProperties(
        String title,
        String version,
        String description,
        String contactName,
        String contactEmail
) {
}
