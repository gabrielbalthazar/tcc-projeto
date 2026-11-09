package com.takehub.backend.projeto;

import com.takehub.backend.auth.User;
import com.takehub.backend.projeto.dto.CreateProjetoRequest;
import com.takehub.backend.projeto.dto.ProjetoResponse;
import com.takehub.backend.projeto.dto.UpdateProjetoRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    public ResponseEntity<List<ProjetoResponse>> getProjetos(@AuthenticationPrincipal User usuario) {
        return ResponseEntity.ok(projetoService.getProjetos(usuario));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjetoResponse> getProjeto(
            @PathVariable UUID id,
            @AuthenticationPrincipal User usuario
    ) {
        return ResponseEntity.ok(projetoService.getProjeto(id, usuario));
    }

    @PostMapping
    public ResponseEntity<ProjetoResponse> createProjeto(@Valid @RequestBody CreateProjetoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projetoService.createProjeto(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjetoResponse> updateProjeto(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProjetoRequest request
    ) {
        return ResponseEntity.ok(projetoService.updateProjeto(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProjeto(@PathVariable UUID id) {
        projetoService.deleteProjeto(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/enviar")
    public ResponseEntity<ProjetoResponse> enviarAoCliente(@PathVariable UUID id) {
        return ResponseEntity.ok(projetoService.enviarAoCliente(id));
    }
}
