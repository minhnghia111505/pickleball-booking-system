package com.pickleball.backend.security;

/**
 * Role names as stored in JWT and {@code UserRole} enum (without {@code ROLE_} prefix).
 */
public final class SecurityRoles {

    public static final String USER = "USER";
    public static final String ADMIN = "ADMIN";

    private SecurityRoles() {
    }
}
