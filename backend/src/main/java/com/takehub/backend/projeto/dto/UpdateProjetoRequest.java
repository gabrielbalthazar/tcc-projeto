package com.takehub.backend.projeto.dto;

import com.takehub.backend.projeto.ProjetoStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public record UpdateProjetoRequest(
        @NotBlank String nome,
        @NotNull UUID clienteId,
        @NotNull UUID editorId,
        @NotNull LocalDate prazo,
        String descricao,
        @NotNull ProjetoStatus status,
        @NotNull @Min(0) @Max(100) Integer progresso
) {
}
