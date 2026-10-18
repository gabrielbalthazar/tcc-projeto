package com.takehub.backend.projeto;

import com.takehub.backend.projeto.dto.CreateProjetoRequest;
import com.takehub.backend.projeto.dto.ProjetoResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projetos")
public class ProjetoController {

    private final ProjetoService projetoService;

    public ProjetoController(ProjetoService projetoService) {
        this.projetoService = projetoService;
    }

    @GetMapping
    public ResponseEntity<List<ProjetoResponse>> getProjetos() {
        return ResponseEntity.ok(projetoService.getProjetos());
    }

    @PostMapping
    public ResponseEntity<ProjetoResponse> createProjeto(@Valid @RequestBody CreateProjetoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projetoService.createProjeto(request));
    }

    @PostMapping("/{id}/enviar")
    public ResponseEntity<ProjetoResponse> enviarAoCliente(@PathVariable UUID id) {
        return ResponseEntity.ok(projetoService.enviarAoCliente(id));
    }
}
