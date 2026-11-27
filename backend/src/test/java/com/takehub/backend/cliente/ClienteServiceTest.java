package com.takehub.backend.cliente;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.takehub.backend.auth.User;
import com.takehub.backend.auth.UserRepository;
import com.takehub.backend.auth.UserRole;
import com.takehub.backend.cliente.dto.ClienteRequest;
import com.takehub.backend.common.exception.ApiException;
import com.takehub.backend.projeto.ProjetoRepository;
import com.takehub.backend.projeto.ProjetoStatus;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProjetoRepository projetoRepository;

    private ClienteService service;
    private User editor;
    private ClienteRequest request;

    @BeforeEach
    void setUp() {
        service = new ClienteService(clienteRepository, userRepository, projetoRepository);
        editor = user("editor@example.com", UserRole.EDITOR, false);
        request = new ClienteRequest("Cliente Teste", "Empresa", "cliente@example.com", "", "");
    }

    @Test
    void rejectsEmailAlreadyOwnedByEditor() {
        User editorAccount = user(request.email(), UserRole.EDITOR, false);
        when(userRepository.findByEmailIgnoreCase(request.email())).thenReturn(Optional.of(editorAccount));

        ApiException exception = assertThrows(ApiException.class, () -> service.criar(request, editor));

        assertEquals(409, exception.getStatus().value());
        verify(clienteRepository, never()).save(any());
    }

    @Test
    void returnsExistingClientWhenAlreadyInEditorsPortfolio() {
        User client = user(request.email(), UserRole.CLIENTE, true);
        Cliente existing = new Cliente();
        existing.setId(UUID.randomUUID());
        existing.setEditor(editor);
        existing.setUsuario(client);
        existing.setNome("Cliente existente");
        when(userRepository.findByEmailIgnoreCase(request.email())).thenReturn(Optional.of(client));
        when(clienteRepository.existsByEditorAndUsuario(editor, client)).thenReturn(true);
        when(clienteRepository.findByEditorAndUsuario(editor, client)).thenReturn(Optional.of(existing));
        when(projetoRepository.countByClienteAndEditorAndStatusNotIn(client, editor,
                List.of(ProjetoStatus.APROVADO, ProjetoStatus.CANCELADO))).thenReturn(0L);

        var response = service.criar(request, editor);

        assertEquals(existing.getId().toString(), response.id());
        verify(clienteRepository, never()).save(any());
    }

    @Test
    void createsAssociationForExistingClientAccount() {
        User client = user(request.email(), UserRole.CLIENTE, true);
        when(userRepository.findByEmailIgnoreCase(request.email())).thenReturn(Optional.of(client));
        when(clienteRepository.existsByEditorAndUsuario(editor, client)).thenReturn(false);
        when(clienteRepository.save(any(Cliente.class))).thenAnswer(invocation -> {
            Cliente saved = invocation.getArgument(0);
            saved.setId(UUID.randomUUID());
            return saved;
        });
        when(projetoRepository.countByClienteAndEditorAndStatusNotIn(client, editor,
                List.of(ProjetoStatus.APROVADO, ProjetoStatus.CANCELADO))).thenReturn(0L);

        var response = service.criar(request, editor);

        assertEquals(request.email(), response.email());
        assertEquals("Cliente Teste", response.nome());
        verify(clienteRepository).save(any(Cliente.class));
    }

    private static User user(String email, UserRole role, boolean pending) {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail(email);
        user.setTipo(role);
        user.setNome("Teste");
        if (!pending) {
            user.setSenhaHash("hash");
        }
        return user;
    }
}
