package com.takehub.backend.usuario;

import com.takehub.backend.auth.User;
import com.takehub.backend.auth.UserRepository;
import com.takehub.backend.auth.UserRole;
import com.takehub.backend.common.exception.ApiException;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UserRepository userRepository;

    public UsuarioService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User buscarComTipo(UUID id, UserRole tipoEsperado, String campo) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, campo + " nao encontrado"));

        if (user.getTipo() != tipoEsperado) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    campo + " deve ser um usuario do tipo " + tipoEsperado.toJson());
        }
        return user;
    }
}
