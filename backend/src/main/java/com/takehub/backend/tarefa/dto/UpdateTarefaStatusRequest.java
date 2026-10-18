package com.takehub.backend.tarefa.dto;

import com.takehub.backend.tarefa.TarefaStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateTarefaStatusRequest(
        @NotNull TarefaStatus status
) {
}
