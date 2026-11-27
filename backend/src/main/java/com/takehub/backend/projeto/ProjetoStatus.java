package com.takehub.backend.projeto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ProjetoStatus {
    EM_ANDAMENTO,
    EM_REVISAO,
    PAUSADO,
    APROVADO,
    RASCUNHO,
    CANCELADO,
    AJUSTES_SOLICITADOS;

    public boolean automatico() {
        return this == EM_REVISAO || this == APROVADO || this == AJUSTES_SOLICITADOS;
    }

    public boolean permiteEnvioDeVersao() {
        return this == RASCUNHO || this == EM_ANDAMENTO || this == AJUSTES_SOLICITADOS;
    }

    @JsonValue
    public String toJson() {
        return name().toLowerCase();
    }

    @JsonCreator
    public static ProjetoStatus fromJson(String value) {
        return ProjetoStatus.valueOf(value.trim().toUpperCase());
    }
}
