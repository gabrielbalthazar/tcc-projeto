package com.takehub.backend.dashboard.dto;

import com.takehub.backend.projeto.Projeto;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public record PrazoProximo(
        String id,
        String nome,
        String cliente,
        LocalDate prazo,
        long diasRestantes
) {
    public static PrazoProximo from(Projeto projeto) {
        long diasRestantes = ChronoUnit.DAYS.between(LocalDate.now(), projeto.getPrazo());
        return new PrazoProximo(
                projeto.getId().toString(),
                projeto.getNome(),
                projeto.getCliente(),
                projeto.getPrazo(),
                diasRestantes
        );
    }
}
