package com.takehub.backend.tarefa;

import com.takehub.backend.auth.UserRole;
import com.takehub.backend.common.exception.ApiException;
import com.takehub.backend.projeto.ProjetoService;
import com.takehub.backend.tarefa.dto.CreateTarefaRequest;
import com.takehub.backend.tarefa.dto.TarefaResponse;
import com.takehub.backend.tarefa.dto.UpdateTarefaRequest;
import com.takehub.backend.usuario.UsuarioService;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class TarefaService {

    private final TarefaRepository tarefaRepository;
    private final ProjetoService projetoService;
    private final UsuarioService usuarioService;

    public TarefaService(
            TarefaRepository tarefaRepository,
            ProjetoService projetoService,
            UsuarioService usuarioService
    ) {
        this.tarefaRepository = tarefaRepository;
        this.projetoService = projetoService;
        this.usuarioService = usuarioService;
    }

    public List<TarefaResponse> getTarefas() {
        return tarefaRepository.findAll().stream()
                .map(TarefaResponse::from)
                .toList();
    }

    public TarefaResponse getTarefa(UUID id) {
        return TarefaResponse.from(findOrThrow(id));
    }

    public TarefaResponse createTarefa(CreateTarefaRequest request) {
        Tarefa tarefa = new Tarefa();
        tarefa.setTitulo(request.titulo());
        tarefa.setDescricao(request.descricao());
        tarefa.setPrioridade(request.prioridade());
        tarefa.setResponsavel(usuarioService.buscarComTipo(request.responsavelId(), UserRole.EDITOR, "Responsavel"));
        tarefa.setProjeto(projetoService.findOrThrow(request.projetoId()));
        tarefa.setStatus(request.status());

        tarefaRepository.save(tarefa);
        return TarefaResponse.from(tarefa);
    }

    public TarefaResponse updateTarefa(UUID id, UpdateTarefaRequest request) {
        Tarefa tarefa = findOrThrow(id);
        tarefa.setTitulo(request.titulo());
        tarefa.setDescricao(request.descricao());
        tarefa.setPrioridade(request.prioridade());
        tarefa.setResponsavel(usuarioService.buscarComTipo(request.responsavelId(), UserRole.EDITOR, "Responsavel"));
        tarefa.setProjeto(projetoService.findOrThrow(request.projetoId()));
        tarefa.setStatus(request.status());

        tarefaRepository.save(tarefa);
        return TarefaResponse.from(tarefa);
    }

    public TarefaResponse atualizarStatus(UUID id, TarefaStatus status) {
        Tarefa tarefa = findOrThrow(id);
        tarefa.setStatus(status);
        tarefaRepository.save(tarefa);
        return TarefaResponse.from(tarefa);
    }

    public void deleteTarefa(UUID id) {
        tarefaRepository.delete(findOrThrow(id));
    }

    private Tarefa findOrThrow(UUID id) {
        return tarefaRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Tarefa nao encontrada"));
    }
}
