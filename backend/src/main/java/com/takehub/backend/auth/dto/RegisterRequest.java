package com.takehub.backend.auth.dto;

import com.takehub.backend.auth.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank String nome,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6, max = 12, message = "A senha deve ter entre 6 e 12 caracteres") String senha,
        @NotNull UserRole tipo
) {
}
