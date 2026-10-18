package com.takehub.backend.tarefa;

import com.takehub.backend.tarefa.dto.CreateTarefaRequest;
import com.takehub.backend.tarefa.dto.TarefaResponse;
import com.takehub.backend.tarefa.dto.UpdateTarefaStatusRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tarefas")
public class TarefaController {

    private final TarefaService tarefaService;

    public TarefaController(TarefaService tarefaService) {
        this.tarefaService = tarefaService;
    }

    @GetMapping
    public ResponseEntity<List<TarefaResponse>> getTarefas() {
        return ResponseEntity.ok(tarefaService.getTarefas());
    }

    @PostMapping
    public ResponseEntity<TarefaResponse> createTarefa(@Valid @RequestBody CreateTarefaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tarefaService.createTarefa(request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TarefaResponse> atualizarStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTarefaStatusRequest request
    ) {
        return ResponseEntity.ok(tarefaService.atualizarStatus(id, request.status()));
    }
}
