package com.takehub.backend.cliente.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClienteRequest(
        @NotBlank @Size(max = 120) String nome,
        @Size(max = 120) String empresa,
        @NotBlank @Email String email,
        @Size(max = 30) String telefone,
        @Size(max = 2000) String observacoes
) {
}
