package com.takehub.backend.projeto;

import com.takehub.backend.auth.User;
import com.takehub.backend.auth.UserRole;
import com.takehub.backend.cliente.ClienteRepository;
import com.takehub.backend.common.exception.ApiException;
import com.takehub.backend.projeto.dto.CreateProjetoRequest;
import com.takehub.backend.projeto.dto.ProjetoResponse;
import com.takehub.backend.projeto.dto.UpdateProjetoRequest;
import com.takehub.backend.tarefa.TarefaRepository;
import com.takehub.backend.usuario.UsuarioService;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjetoService {

    private final ProjetoRepository projetoRepository;
    private final TarefaRepository tarefaRepository;
    private final UsuarioService usuarioService;
    private final ClienteRepository clienteRepository;

    public ProjetoService(
            ProjetoRepository projetoRepository,
            TarefaRepository tarefaRepository,
            UsuarioService usuarioService,
            ClienteRepository clienteRepository) {
        this.projetoRepository = projetoRepository;
        this.tarefaRepository = tarefaRepository;
        this.usuarioService = usuarioService;
        this.clienteRepository = clienteRepository;
    }

    public List<ProjetoResponse> getProjetos(User usuarioLogado) {
        List<Projeto> projetos = usuarioLogado.getTipo() == UserRole.CLIENTE
                ? projetoRepository.findByClienteAndStatusNotOrderByPrazoAsc(usuarioLogado, ProjetoStatus.RASCUNHO)
                : projetoRepository.findByEditorOrderByPrazoAsc(usuarioLogado);

        return projetos.stream().map(ProjetoResponse::from).toList();
    }

    public ProjetoResponse getProjeto(UUID id, User usuarioLogado) {
        if (usuarioLogado.getTipo() == UserRole.EDITOR) {
            return ProjetoResponse.from(findDoEditor(id, usuarioLogado));
        }

        Projeto projeto = projetoRepository.findById(id)
                .filter(p -> p.getCliente().getId().equals(usuarioLogado.getId()))
                .filter(p -> p.getStatus() != ProjetoStatus.RASCUNHO)
                .orElseThrow(ProjetoService::naoEncontrado);
        return ProjetoResponse.from(projeto);
    }

    public ProjetoResponse createProjeto(CreateProjetoRequest request, User editor) {
        Projeto projeto = new Projeto();
        projeto.setNome(request.nome());
        projeto.setDescricao(request.descricao());
        projeto.setCliente(buscarClienteDoEditor(request.clienteId(), editor));
        projeto.setEditor(editor);
        projeto.setPrazo(request.prazo());
        projeto.setStatus(ProjetoStatus.RASCUNHO);
        projeto.setProgresso(0);

        projetoRepository.save(projeto);
        return ProjetoResponse.from(projeto);
    }

    public ProjetoResponse updateProjeto(UUID id, UpdateProjetoRequest request, User editor) {
        Projeto projeto = findDoEditor(id, editor);
        projeto.setNome(request.nome());
        projeto.setDescricao(request.descricao());
        if (!projeto.getCliente().getId().equals(request.clienteId())) {
            projeto.setCliente(buscarClienteDoEditor(request.clienteId(), editor));
        }
        projeto.setPrazo(request.prazo());
        projeto.setStatus(request.status());
        projeto.setProgresso(request.progresso());

        projetoRepository.save(projeto);
        return ProjetoResponse.from(projeto);
    }

    @Transactional
    public void deleteProjeto(UUID id, User editor) {
        Projeto projeto = findDoEditor(id, editor);
        tarefaRepository.deleteByProjeto(projeto);
        projetoRepository.delete(projeto);
    }

    public ProjetoResponse enviarAoCliente(UUID id, User editor) {
        Projeto projeto = findDoEditor(id, editor);
        projeto.setStatus(ProjetoStatus.EM_REVISAO);
        projetoRepository.save(projeto);
        return ProjetoResponse.from(projeto);
    }

    private User buscarClienteDoEditor(UUID clienteId, User editor) {
        User cliente = usuarioService.buscarComTipo(clienteId, UserRole.CLIENTE, "Cliente");
        if (!clienteRepository.existsByEditorAndUsuario(editor, cliente)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Cliente nao esta na sua lista de clientes");
        }
        return cliente;
    }

    public Projeto findDoEditor(UUID id, User editor) {
        return projetoRepository.findByIdAndEditor(id, editor)
                .orElseThrow(ProjetoService::naoEncontrado);
    }

    private static ApiException naoEncontrado() {
        return new ApiException(HttpStatus.NOT_FOUND, "Projeto nao encontrado");
    }
}
