package com.takehub.backend.versao.dto;

import jakarta.validation.constraints.NotBlank;

public record AvaliacaoVersaoRequest(
        @NotBlank String decisao,
        String comentario
) {}
