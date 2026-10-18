package com.takehub.backend.dashboard.dto;

import java.util.List;

public record DashboardResponse(
        List<StatCard> stats,
        List<ProjetoProgresso> projetos,
        List<PrazoProximo> prazos
) {
}
