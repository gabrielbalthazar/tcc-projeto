package com.takehub.backend.cliente;

import com.takehub.backend.auth.User;
import com.takehub.backend.auth.UserRepository;
import com.takehub.backend.auth.UserRole;
import com.takehub.backend.cliente.dto.ClienteRequest;
import com.takehub.backend.cliente.dto.ClienteResponse;
import com.takehub.backend.common.exception.ApiException;
import com.takehub.backend.projeto.ProjetoRepository;
import com.takehub.backend.projeto.ProjetoStatus;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClienteService {

    /** Projetos encerrados nao contam como "ativos" no card do cliente. */
    private static final List<ProjetoStatus> STATUS_ENCERRADOS =
            List.of(ProjetoStatus.APROVADO, ProjetoStatus.CANCELADO);

    private final ClienteRepository clienteRepository;
    private final UserRepository userRepository;
    private final ProjetoRepository projetoRepository;

    public ClienteService(
            ClienteRepository clienteRepository,
            UserRepository userRepository,
            ProjetoRepository projetoRepository) {
        this.clienteRepository = clienteRepository;
        this.userRepository = userRepository;
        this.projetoRepository = projetoRepository;
    }

    /** Cada editor ve apenas os clientes da propria carteira. */
    public List<ClienteResponse> listar(User editor) {
        Map<UUID, Long> projetosAtivos = projetoRepository.countAtivosPorCliente(editor, STATUS_ENCERRADOS).stream()
                .collect(Collectors.toMap(linha -> (UUID) linha[0], linha -> (Long) linha[1]));

        return clienteRepository.findByEditorOrderByNomeAsc(editor).stream()
                .map(cliente -> toResponse(cliente, projetosAtivos.getOrDefault(cliente.getUsuario().getId(), 0L)))
                .toList();
    }

    /**
     * Adiciona o cliente a carteira do editor. Se ja existe uma conta de cliente com o e-mail
     * (ativa ou cadastrada por outro editor), ela e reaproveitada; senao, cria uma conta sem senha,
     * que o cliente ativa ao se registrar com o mesmo e-mail (ver AuthService.register).
     */
    @Transactional
    public ClienteResponse criar(ClienteRequest request, User editor) {
        String email = normalizarEmail(request.email());
        User usuario = userRepository.findByEmailIgnoreCase(email)
                .orElseGet(() -> criarContaPendente(email, request.nome()));

        if (usuario.getTipo() != UserRole.CLIENTE) {
            throw new ApiException(HttpStatus.CONFLICT, "Este e-mail pertence a uma conta de editor");
        }
        if (clienteRepository.existsByEditorAndUsuario(editor, usuario)) {
            throw new ApiException(HttpStatus.CONFLICT, "Este cliente ja esta na sua lista");
        }

        Cliente cliente = new Cliente();
        cliente.setEditor(editor);
        cliente.setUsuario(usuario);
        preencher(cliente, request);
        clienteRepository.save(cliente);

        long ativos = projetoRepository.countByClienteAndEditorAndStatusNotIn(usuario, editor, STATUS_ENCERRADOS);
        return toResponse(cliente, ativos);
    }

    @Transactional
    public ClienteResponse atualizar(UUID id, ClienteRequest request, User editor) {
        Cliente cliente = clienteRepository.findByIdAndEditor(id, editor)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Cliente nao encontrado"));
        User usuario = cliente.getUsuario();

        String email = normalizarEmail(request.email());
        if (!usuario.getEmail().equalsIgnoreCase(email)) {
            if (!emailEditavel(cliente)) {
                throw new ApiException(
                        HttpStatus.BAD_REQUEST,
                        "O e-mail e o acesso do cliente e nao pode mais ser alterado por voce");
            }
            if (userRepository.existsByEmailIgnoreCase(email)) {
                throw new ApiException(HttpStatus.CONFLICT, "Ja existe uma conta com este e-mail");
            }
            usuario.setEmail(email);
            userRepository.save(usuario);
        }

        preencher(cliente, request);
        clienteRepository.save(cliente);

        long ativos = projetoRepository.countByClienteAndEditorAndStatusNotIn(usuario, editor, STATUS_ENCERRADOS);
        return toResponse(cliente, ativos);
    }

    /**
     * O editor so pode corrigir o e-mail enquanto a conta nao foi ativada e ninguem mais
     * depende dela; depois disso o e-mail e o login do cliente.
     */
    private boolean emailEditavel(Cliente cliente) {
        User usuario = cliente.getUsuario();
        return usuario.isCadastroPendente() && clienteRepository.countByUsuario(usuario) == 1;
    }

    private User criarContaPendente(String email, String nome) {
        User usuario = new User();
        usuario.setTipo(UserRole.CLIENTE);
        usuario.setEmail(email);
        usuario.setNome(nome.trim());
        return userRepository.save(usuario);
    }

    private ClienteResponse toResponse(Cliente cliente, long projetosAtivos) {
        return ClienteResponse.from(cliente, projetosAtivos, emailEditavel(cliente));
    }

    private void preencher(Cliente cliente, ClienteRequest request) {
        cliente.setNome(request.nome().trim());
        cliente.setEmpresa(vazioParaNulo(request.empresa()));
        cliente.setTelefone(vazioParaNulo(request.telefone()));
        cliente.setObservacoes(vazioParaNulo(request.observacoes()));
    }

    private static String normalizarEmail(String email) {
        return email.trim().toLowerCase();
    }

    private static String vazioParaNulo(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }
}
