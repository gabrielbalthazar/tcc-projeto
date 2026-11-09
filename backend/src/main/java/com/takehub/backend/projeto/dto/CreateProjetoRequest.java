package com.takehub.backend.projeto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public record CreateProjetoRequest(
        @NotBlank String nome,
        @NotNull UUID clienteId,
        @NotNull UUID editorId,
        @NotNull LocalDate prazo,
        String descricao
) {
}
