package com.takehub.backend.dashboard;

import com.takehub.backend.dashboard.dto.DashboardResponse;
import com.takehub.backend.dashboard.dto.PrazoProximo;
import com.takehub.backend.dashboard.dto.ProjetoProgresso;
import com.takehub.backend.dashboard.dto.StatCard;
import com.takehub.backend.projeto.Projeto;
import com.takehub.backend.projeto.ProjetoRepository;
import com.takehub.backend.projeto.ProjetoStatus;
import com.takehub.backend.tarefa.TarefaRepository;
import com.takehub.backend.tarefa.TarefaStatus;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final ProjetoRepository projetoRepository;
    private final TarefaRepository tarefaRepository;

    public DashboardService(ProjetoRepository projetoRepository, TarefaRepository tarefaRepository) {
        this.projetoRepository = projetoRepository;
        this.tarefaRepository = tarefaRepository;
    }

    public DashboardResponse getData() {
        return new DashboardResponse(getStats(), getProjetos(), getPrazos());
    }

    public List<ProjetoProgresso> getProjetos() {
        return projetoRepository.findAll().stream()
                .map(ProjetoProgresso::from)
                .toList();
    }

    public List<PrazoProximo> getPrazos() {
        return projetoRepository.findAll().stream()
                .sorted(Comparator.comparing(Projeto::getPrazo))
                .map(PrazoProximo::from)
                .toList();
    }

    private List<StatCard> getStats() {
        long projetosAtivos = projetoRepository.countByStatus(ProjetoStatus.EM_ANDAMENTO);
        long tarefasPendentes = tarefaRepository.countByStatus(TarefaStatus.PENDENTE);
        long emRevisao = projetoRepository.countByStatus(ProjetoStatus.EM_REVISAO);
        long concluidos = projetoRepository.countByStatus(ProjetoStatus.APROVADO);

        return List.of(
                new StatCard("folder_open", projetosAtivos, "Projetos Ativos", "#7c3aed"),
                new StatCard("format_list_bulleted", tarefasPendentes, "Tarefas Pendentes", "#f59e0b"),
                new StatCard("schedule", emRevisao, "Em Revisão", "#06b6d4"),
                new StatCard("check_circle", concluidos, "Concluídos", "#10b981")
        );
    }
}
