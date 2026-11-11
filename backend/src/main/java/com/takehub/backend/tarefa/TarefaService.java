package com.takehub.backend.tarefa;

import com.takehub.backend.auth.User;
import com.takehub.backend.common.exception.ApiException;
import com.takehub.backend.projeto.ProjetoService;
import com.takehub.backend.tarefa.dto.CreateTarefaRequest;
import com.takehub.backend.tarefa.dto.TarefaResponse;
import com.takehub.backend.tarefa.dto.UpdateTarefaRequest;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class TarefaService {

    private final TarefaRepository tarefaRepository;
    private final ProjetoService projetoService;

    public TarefaService(TarefaRepository tarefaRepository, ProjetoService projetoService) {
        this.tarefaRepository = tarefaRepository;
        this.projetoService = projetoService;
    }

    /** O editor ve apenas as tarefas dos proprios projetos. */
    public List<TarefaResponse> getTarefas(User editor) {
        return tarefaRepository.findByProjetoEditor(editor).stream()
                .map(TarefaResponse::from)
                .toList();
    }

    public TarefaResponse getTarefa(UUID id, User editor) {
        return TarefaResponse.from(findOrThrow(id, editor));
    }

    /** Sem equipes por enquanto: o responsavel pela tarefa e sempre o editor logado. */
    public TarefaResponse createTarefa(CreateTarefaRequest request, User editor) {
        Tarefa tarefa = new Tarefa();
        tarefa.setTitulo(request.titulo());
        tarefa.setDescricao(request.descricao());
        tarefa.setPrioridade(request.prioridade());
        tarefa.setResponsavel(editor);
        tarefa.setProjeto(projetoService.findDoEditor(request.projetoId(), editor));
        tarefa.setStatus(request.status());

        tarefaRepository.save(tarefa);
        return TarefaResponse.from(tarefa);
    }

    public TarefaResponse updateTarefa(UUID id, UpdateTarefaRequest request, User editor) {
        Tarefa tarefa = findOrThrow(id, editor);
        tarefa.setTitulo(request.titulo());
        tarefa.setDescricao(request.descricao());
        tarefa.setPrioridade(request.prioridade());
        tarefa.setProjeto(projetoService.findDoEditor(request.projetoId(), editor));
        tarefa.setStatus(request.status());

        tarefaRepository.save(tarefa);
        return TarefaResponse.from(tarefa);
    }

    public TarefaResponse atualizarStatus(UUID id, TarefaStatus status, User editor) {
        Tarefa tarefa = findOrThrow(id, editor);
        tarefa.setStatus(status);
        tarefaRepository.save(tarefa);
        return TarefaResponse.from(tarefa);
    }

    public void deleteTarefa(UUID id, User editor) {
        tarefaRepository.delete(findOrThrow(id, editor));
    }

    private Tarefa findOrThrow(UUID id, User editor) {
        return tarefaRepository.findByIdAndProjetoEditor(id, editor)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Tarefa nao encontrada"));
    }
}
