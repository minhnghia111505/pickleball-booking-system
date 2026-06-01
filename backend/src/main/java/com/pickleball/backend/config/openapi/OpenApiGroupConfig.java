package com.pickleball.backend.config.openapi;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiGroupConfig {

    @Bean
    public GroupedOpenApi allApi() {
        return buildGroup("all", "All APIs", "/**");
    }

    @Bean
    public GroupedOpenApi authApi() {
        return buildGroup("auth", "Auth", "/auth/**");
    }

    @Bean
    public GroupedOpenApi userApi() {
        return buildGroup("user", "User", "/users/**");
    }

    @Bean
    public GroupedOpenApi courtApi() {
        return buildGroup("court", "Court", "/courts/**");
    }

    @Bean
    public GroupedOpenApi bookingApi() {
        return buildGroup("booking", "Booking", "/bookings/**");
    }

    @Bean
    public GroupedOpenApi scheduleApi() {
        return buildGroup("schedule", "Schedule", "/schedules/**");
    }

    @Bean
    public GroupedOpenApi statisticsApi() {
        return buildGroup("statistics", "Statistics", "/statistics/**");
    }

    private GroupedOpenApi buildGroup(String name, String displayName, String pathPattern) {
        return GroupedOpenApi.builder()
                .group(name)
                .displayName(displayName)
                .pathsToMatch(pathPattern)
                .build();
    }
}
