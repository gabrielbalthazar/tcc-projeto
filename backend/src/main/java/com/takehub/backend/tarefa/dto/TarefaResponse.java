package com.takehub.backend.tarefa.dto;

import com.takehub.backend.tarefa.Tarefa;
import com.takehub.backend.tarefa.TarefaPrioridade;
import com.takehub.backend.tarefa.TarefaStatus;

public record TarefaResponse(
        String id,
        String titulo,
        String descricao,
        TarefaPrioridade prioridade,
        String responsavelId,
        String responsavel,
        String projetoId,
        String projeto,
        TarefaStatus status
) {
    public static TarefaResponse from(Tarefa tarefa) {
        return new TarefaResponse(
                tarefa.getId().toString(),
                tarefa.getTitulo(),
                tarefa.getDescricao(),
                tarefa.getPrioridade(),
                tarefa.getResponsavel().getId().toString(),
                tarefa.getResponsavel().getNome(),
                tarefa.getProjeto().getId().toString(),
                tarefa.getProjeto().getNome(),
                tarefa.getStatus()
        );
    }
}
