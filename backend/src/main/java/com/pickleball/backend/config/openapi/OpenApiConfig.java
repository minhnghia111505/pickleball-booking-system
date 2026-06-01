package com.pickleball.backend.config.openapi;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI(OpenApiProperties properties) {
        return new OpenAPI()
                .info(apiInfo(properties))
                .addSecurityItem(new SecurityRequirement().addList(OpenApiConstants.BEARER_SCHEME))
                .components(new Components()
                        .addSecuritySchemes(OpenApiConstants.BEARER_SCHEME, bearerSecurityScheme()));
    }

    private Info apiInfo(OpenApiProperties properties) {
        return new Info()
                .title(properties.title())
                .version(properties.version())
                .description(properties.description())
                .contact(new Contact()
                        .name(properties.contactName())
                        .email(properties.contactEmail()));
    }

    private SecurityScheme bearerSecurityScheme() {
        return new SecurityScheme()
                .name(OpenApiConstants.BEARER_SCHEME)
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .description("Paste access token from login (without the \"Bearer \" prefix).");
    }
}
