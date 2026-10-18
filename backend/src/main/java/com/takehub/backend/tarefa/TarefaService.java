package com.takehub.backend.tarefa;

import com.takehub.backend.common.exception.ApiException;
import com.takehub.backend.tarefa.dto.CreateTarefaRequest;
import com.takehub.backend.tarefa.dto.TarefaResponse;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class TarefaService {

    private final TarefaRepository tarefaRepository;

    public TarefaService(TarefaRepository tarefaRepository) {
        this.tarefaRepository = tarefaRepository;
    }

    public List<TarefaResponse> getTarefas() {
        return tarefaRepository.findAll().stream()
                .map(TarefaResponse::from)
                .toList();
    }

    public TarefaResponse createTarefa(CreateTarefaRequest request) {
        Tarefa tarefa = new Tarefa();
        tarefa.setTitulo(request.titulo());
        tarefa.setDescricao(request.descricao());
        tarefa.setPrioridade(request.prioridade());
        tarefa.setResponsavel(request.responsavel());
        tarefa.setProjeto(request.projeto());
        tarefa.setStatus(request.status());

        tarefaRepository.save(tarefa);
        return TarefaResponse.from(tarefa);
    }

    public TarefaResponse atualizarStatus(UUID id, TarefaStatus status) {
        Tarefa tarefa = tarefaRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Tarefa nao encontrada"));
        tarefa.setStatus(status);
        tarefaRepository.save(tarefa);
        return TarefaResponse.from(tarefa);
    }
}
