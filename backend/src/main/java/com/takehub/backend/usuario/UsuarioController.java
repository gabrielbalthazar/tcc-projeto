package com.takehub.backend.usuario;

import com.takehub.backend.auth.UserRole;
import com.takehub.backend.common.exception.ApiException;
import com.takehub.backend.usuario.dto.UsuarioResumo;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResumo>> listar(@RequestParam(required = false) String tipo) {
        return ResponseEntity.ok(usuarioService.listar(parseTipo(tipo)));
    }

    private UserRole parseTipo(String tipo) {
        if (tipo == null || tipo.isBlank()) {
            return null;
        }
        try {
            return UserRole.fromJson(tipo);
        } catch (IllegalArgumentException ex) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Tipo de usuario invalido: " + tipo);
        }
    }
}
