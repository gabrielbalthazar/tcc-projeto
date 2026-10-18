package com.takehub.backend.projeto.dto;

import com.takehub.backend.projeto.Projeto;
import com.takehub.backend.projeto.ProjetoStatus;
import java.time.LocalDate;

public record ProjetoResponse(
        String id,
        String nome,
        String descricao,
        String cliente,
        String editor,
        ProjetoStatus status,
        Integer progresso,
        LocalDate prazo,
        ProjetoFeedbackResponse feedback
) {
    public static ProjetoResponse from(Projeto projeto) {
        ProjetoFeedbackResponse feedback = projeto.getFeedbackMensagem() == null
                ? null
                : new ProjetoFeedbackResponse(
                        projeto.getFeedbackAutor(),
                        projeto.getFeedbackVersao(),
                        projeto.getFeedbackData(),
                        projeto.getFeedbackMensagem(),
                        projeto.getFeedbackRejeicoes()
                );

        return new ProjetoResponse(
                projeto.getId().toString(),
                projeto.getNome(),
                projeto.getDescricao(),
                projeto.getCliente(),
                projeto.getEditor(),
                projeto.getStatus(),
                projeto.getProgresso(),
                projeto.getPrazo(),
                feedback
        );
    }
}
