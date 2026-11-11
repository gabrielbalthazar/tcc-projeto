package com.takehub.backend.dashboard;

import com.takehub.backend.auth.User;
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

    /** O dashboard considera apenas os projetos e tarefas do editor logado. */
    public DashboardResponse getData(User editor) {
        return new DashboardResponse(getStats(editor), getProjetos(editor), getPrazos(editor));
    }

    public List<ProjetoProgresso> getProjetos(User editor) {
        return projetoRepository.findByEditorOrderByPrazoAsc(editor).stream()
                .map(ProjetoProgresso::from)
                .toList();
    }

    public List<PrazoProximo> getPrazos(User editor) {
        return projetoRepository.findByEditorOrderByPrazoAsc(editor).stream()
                .filter(p -> p.getStatus() != ProjetoStatus.APROVADO && p.getStatus() != ProjetoStatus.CANCELADO)
                .sorted(Comparator.comparing(Projeto::getPrazo))
                .map(PrazoProximo::from)
                .toList();
    }

    private List<StatCard> getStats(User editor) {
        long projetosAtivos = projetoRepository.countByEditorAndStatus(editor, ProjetoStatus.EM_ANDAMENTO);
        long tarefasPendentes = tarefaRepository.countByProjetoEditorAndStatus(editor, TarefaStatus.PENDENTE);
        long emRevisao = projetoRepository.countByEditorAndStatus(editor, ProjetoStatus.EM_REVISAO);
        long concluidos = projetoRepository.countByEditorAndStatus(editor, ProjetoStatus.APROVADO);

        return List.of(
                new StatCard("folder_open", projetosAtivos, "Projetos Ativos", "#7c3aed"),
                new StatCard("format_list_bulleted", tarefasPendentes, "Tarefas Pendentes", "#f59e0b"),
                new StatCard("schedule", emRevisao, "Em Revisão", "#06b6d4"),
                new StatCard("check_circle", concluidos, "Concluídos", "#10b981")
        );
    }
}
