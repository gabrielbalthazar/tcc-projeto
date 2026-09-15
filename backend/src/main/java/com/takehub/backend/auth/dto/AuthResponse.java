package com.takehub.backend.auth.dto;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
