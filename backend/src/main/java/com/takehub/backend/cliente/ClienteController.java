package com.takehub.backend.cliente;

import com.takehub.backend.auth.User;
import com.takehub.backend.cliente.dto.ClienteRequest;
import com.takehub.backend.cliente.dto.ClienteResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public ResponseEntity<List<ClienteResponse>> listar(@AuthenticationPrincipal User editor) {
        return ResponseEntity.ok(clienteService.listar(editor));
    }

    @PostMapping
    public ResponseEntity<ClienteResponse> criar(
            @Valid @RequestBody ClienteRequest request,
            @AuthenticationPrincipal User editor
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.criar(request, editor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponse> atualizar(
            @PathVariable UUID id,
            @Valid @RequestBody ClienteRequest request,
            @AuthenticationPrincipal User editor
    ) {
        return ResponseEntity.ok(clienteService.atualizar(id, request, editor));
    }
}
