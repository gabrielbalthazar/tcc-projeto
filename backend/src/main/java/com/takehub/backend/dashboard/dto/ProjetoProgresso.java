package com.takehub.backend.dashboard.dto;

import com.takehub.backend.projeto.Projeto;
import com.takehub.backend.projeto.ProjetoStatus;
import java.time.LocalDate;

public record ProjetoProgresso(
        String id,
        String nome,
        String cliente,
        ProjetoStatus status,
        Integer progresso,
        LocalDate prazo
) {
    public static ProjetoProgresso from(Projeto projeto) {
        return new ProjetoProgresso(
                projeto.getId().toString(),
                projeto.getNome(),
                projeto.getCliente(),
                projeto.getStatus(),
                projeto.getProgresso(),
                projeto.getPrazo()
        );
    }
}
