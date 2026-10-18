package com.takehub.backend.tarefa;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TarefaPrioridade {
    BAIXA,
    MEDIA,
    ALTA;

    @JsonValue
    public String toJson() {
        return name().toLowerCase();
    }

    @JsonCreator
    public static TarefaPrioridade fromJson(String value) {
        return TarefaPrioridade.valueOf(value.trim().toUpperCase());
    }
}
