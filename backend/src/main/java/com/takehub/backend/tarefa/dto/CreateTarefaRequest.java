package com.takehub.backend.tarefa.dto;

import com.takehub.backend.tarefa.TarefaPrioridade;
import com.takehub.backend.tarefa.TarefaStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateTarefaRequest(
        @NotBlank String titulo,
        String descricao,
        @NotNull TarefaPrioridade prioridade,
        @NotBlank String responsavel,
        @NotBlank String projeto,
        @NotNull TarefaStatus status
) {
}
