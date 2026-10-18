package com.takehub.backend.projeto.dto;

import java.time.LocalDate;

public record ProjetoFeedbackResponse(
        String autor,
        String versao,
        LocalDate data,
        String mensagem,
        Integer rejeicoes
) {
}
