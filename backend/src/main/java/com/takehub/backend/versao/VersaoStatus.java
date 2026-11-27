package com.takehub.backend.versao;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum VersaoStatus {
    AGUARDANDO_REVISAO,
    AJUSTES_SOLICITADOS,
    APROVADA;

    @JsonValue
    public String toJson() {
        return name().toLowerCase();
    }

    @JsonCreator
    public static VersaoStatus fromJson(String value) {
        return valueOf(value.trim().toUpperCase());
    }
}
