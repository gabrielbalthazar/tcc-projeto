package com.takehub.backend.versao;

import com.takehub.backend.auth.User;
import com.takehub.backend.versao.dto.AvaliacaoVersaoRequest;
import com.takehub.backend.versao.dto.VersaoResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class VersaoController {
    private final VersaoService service;

    public VersaoController(VersaoService service) { this.service = service; }

    @GetMapping("/projetos/{projetoId}/versoes")
    public List<VersaoResponse> listar(@PathVariable UUID projetoId, @AuthenticationPrincipal User usuario) {
        return service.listar(projetoId, usuario);
    }

    @PostMapping(value = "/projetos/{projetoId}/versoes", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VersaoResponse> criar(@PathVariable UUID projetoId, @RequestPart MultipartFile arquivo,
                                                 @RequestPart(required = false) String mensagem,
                                                 @AuthenticationPrincipal User editor) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(projetoId, arquivo, mensagem, editor));
    }

    @PostMapping("/versoes/{id}/avaliar")
    public VersaoResponse avaliar(@PathVariable UUID id, @Valid @RequestBody AvaliacaoVersaoRequest request,
                                  @AuthenticationPrincipal User cliente) {
        return service.avaliar(id, request, cliente);
    }
}
