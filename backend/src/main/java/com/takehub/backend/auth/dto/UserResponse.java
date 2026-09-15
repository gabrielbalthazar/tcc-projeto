package com.takehub.backend.auth.dto;

import com.takehub.backend.auth.User;
import com.takehub.backend.auth.UserRole;
import java.time.LocalDateTime;

public record UserResponse(
        String id,
        String nome,
        String email,
        UserRole tipo,
        LocalDateTime criadoEm,
        String cargo,
        String telefone
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId().toString(),
                user.getNome(),
                user.getEmail(),
                user.getTipo(),
                user.getCriadoEm(),
                user.getCargo(),
                user.getTelefone()
        );
    }
}
