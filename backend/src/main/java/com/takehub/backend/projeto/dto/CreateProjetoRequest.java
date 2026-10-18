package com.takehub.backend.projeto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CreateProjetoRequest(
        @NotBlank String nome,
        @NotBlank String cliente,
        @NotBlank String editor,
        @NotNull LocalDate prazo,
        String descricao
) {
}
