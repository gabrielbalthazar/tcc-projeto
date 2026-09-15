package com.takehub.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateUserRequest(
        @NotBlank String nome,
        @NotBlank @Email String email,
        String telefone,
        String cargo
) {
}
