package com.takehub.backend.usuario.dto;

import com.takehub.backend.auth.User;
import com.takehub.backend.auth.UserRole;

public record UsuarioResumo(
        String id,
        String nome,
        String email,
        UserRole tipo) {
    public static UsuarioResumo from(User user) {
        return new UsuarioResumo(user.getId().toString(), user.getNome(), user.getEmail(), user.getTipo());
    }
}
