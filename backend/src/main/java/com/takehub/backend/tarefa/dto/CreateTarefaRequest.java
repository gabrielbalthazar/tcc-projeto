package com.takehub.backend.tarefa.dto;

import com.takehub.backend.tarefa.TarefaPrioridade;
import com.takehub.backend.tarefa.TarefaStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreateTarefaRequest(
                @NotBlank String titulo,
                String descricao,
                @NotNull TarefaPrioridade prioridade,
                @NotNull UUID responsavelId,
                @NotNull UUID projetoId,
                @NotNull TarefaStatus status) {
}
