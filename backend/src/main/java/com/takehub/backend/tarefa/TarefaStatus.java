package com.takehub.backend.tarefa;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TarefaStatus {
    PENDENTE,
    EM_PROGRESSO,
    REVISAO,
    CONCLUIDO;

    @JsonValue
    public String toJson() {
        return name().toLowerCase();
    }

    @JsonCreator
    public static TarefaStatus fromJson(String value) {
        return TarefaStatus.valueOf(value.trim().toUpperCase());
    }
}
