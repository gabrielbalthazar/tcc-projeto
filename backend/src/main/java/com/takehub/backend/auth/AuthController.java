package com.takehub.backend.auth;

import com.takehub.backend.auth.dto.AuthResponse;
import com.takehub.backend.auth.dto.LoginRequest;
import com.takehub.backend.auth.dto.RegisterRequest;
import com.takehub.backend.auth.dto.UpdateUserRequest;
import com.takehub.backend.auth.dto.UserResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(authService.getCurrentUser(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMe(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        return ResponseEntity.ok(authService.updateCurrentUser(user, request));
    }
}
