package com.takehub.backend.auth;

import com.takehub.backend.auth.dto.AuthResponse;
import com.takehub.backend.auth.dto.LoginRequest;
import com.takehub.backend.auth.dto.RegisterRequest;
import com.takehub.backend.auth.dto.UpdateUserRequest;
import com.takehub.backend.auth.dto.UserResponse;
import com.takehub.backend.common.exception.ApiException;
import com.takehub.backend.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "E-mail ja cadastrado");
        }

        User user = new User();
        user.setNome(request.nome());
        user.setEmail(request.email());
        user.setSenhaHash(passwordEncoder.encode(request.senha()));
        user.setTipo(request.tipo());
        userRepository.save(user);

        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("E-mail ou senha invalidos"));

        if (!passwordEncoder.matches(request.senha(), user.getSenhaHash())) {
            throw new BadCredentialsException("E-mail ou senha invalidos");
        }

        return buildAuthResponse(user);
    }

    public UserResponse getCurrentUser(User user) {
        return UserResponse.from(user);
    }

    public UserResponse updateCurrentUser(User user, UpdateUserRequest request) {
        if (!user.getEmail().equalsIgnoreCase(request.email()) && userRepository.existsByEmail(request.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "E-mail ja cadastrado");
        }

        user.setNome(request.nome());
        user.setEmail(request.email());
        user.setTelefone(request.telefone());
        user.setCargo(request.cargo());
        userRepository.save(user);

        return UserResponse.from(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, UserResponse.from(user));
    }
}
