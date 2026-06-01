package com.pickleball.backend.config.openapi;

public final class OpenApiConstants {

    public static final String BEARER_SCHEME = "bearer-jwt";

    public static final String[] SWAGGER_WHITELIST = {
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/v3/api-docs/**"
    };

    private OpenApiConstants() {
    }
}
