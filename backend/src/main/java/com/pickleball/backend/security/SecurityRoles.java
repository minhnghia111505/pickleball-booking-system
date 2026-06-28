package com.pickleball.backend.security;

/**
 * Role names as stored in JWT and {@code UserRole} enum (without {@code ROLE_} prefix).
 */
public final class SecurityRoles {

    public static final String USER = "USER";
    public static final String STAFF = "STAFF";
    public static final String MANAGER = "MANAGER";
    public static final String SUPER_ADMIN = "SUPER_ADMIN";

    /**
     * @deprecated Use {@link #SUPER_ADMIN} instead. Kept for backward compatibility.
     */
    @Deprecated
    public static final String ADMIN = "SUPER_ADMIN";

    private SecurityRoles() {
    }
}
