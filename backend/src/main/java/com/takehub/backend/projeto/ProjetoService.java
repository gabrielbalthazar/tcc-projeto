package com.takehub.backend.projeto;

import com.takehub.backend.auth.User;
import com.takehub.backend.auth.UserRole;
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

    public ProjetoService(
            ProjetoRepository projetoRepository,
            TarefaRepository tarefaRepository,
            UsuarioService usuarioService) {
        this.projetoRepository = projetoRepository;
        this.tarefaRepository = tarefaRepository;
        this.usuarioService = usuarioService;
    }

    public List<ProjetoResponse> getProjetos(User usuarioLogado) {
        List<Projeto> projetos = usuarioLogado.getTipo() == UserRole.CLIENTE
                ? projetoRepository.findByClienteOrderByPrazoAsc(usuarioLogado)
                : projetoRepository.findAllByOrderByPrazoAsc();

        return projetos.stream().map(ProjetoResponse::from).toList();
    }

    public ProjetoResponse getProjeto(UUID id, User usuarioLogado) {
        Projeto projeto = findOrThrow(id);

        if (usuarioLogado.getTipo() == UserRole.CLIENTE
                && !projeto.getCliente().getId().equals(usuarioLogado.getId())) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Projeto nao encontrado");
        }
        return ProjetoResponse.from(projeto);
    }

    public ProjetoResponse createProjeto(CreateProjetoRequest request) {
        Projeto projeto = new Projeto();
        projeto.setNome(request.nome());
        projeto.setDescricao(request.descricao());
        projeto.setCliente(usuarioService.buscarComTipo(request.clienteId(), UserRole.CLIENTE, "Cliente"));
        projeto.setEditor(usuarioService.buscarComTipo(request.editorId(), UserRole.EDITOR, "Editor"));
        projeto.setPrazo(request.prazo());
        projeto.setStatus(ProjetoStatus.RASCUNHO);
        projeto.setProgresso(0);

        projetoRepository.save(projeto);
        return ProjetoResponse.from(projeto);
    }

    public ProjetoResponse updateProjeto(UUID id, UpdateProjetoRequest request) {
        Projeto projeto = findOrThrow(id);
        projeto.setNome(request.nome());
        projeto.setDescricao(request.descricao());
        projeto.setCliente(usuarioService.buscarComTipo(request.clienteId(), UserRole.CLIENTE, "Cliente"));
        projeto.setEditor(usuarioService.buscarComTipo(request.editorId(), UserRole.EDITOR, "Editor"));
        projeto.setPrazo(request.prazo());
        projeto.setStatus(request.status());
        projeto.setProgresso(request.progresso());

        projetoRepository.save(projeto);
        return ProjetoResponse.from(projeto);
    }

    @Transactional
    public void deleteProjeto(UUID id) {
        Projeto projeto = findOrThrow(id);
        tarefaRepository.deleteByProjeto(projeto);
        projetoRepository.delete(projeto);
    }

    public ProjetoResponse enviarAoCliente(UUID id) {
        Projeto projeto = findOrThrow(id);
        projeto.setStatus(ProjetoStatus.EM_REVISAO);
        projetoRepository.save(projeto);
        return ProjetoResponse.from(projeto);
    }

    public Projeto findOrThrow(UUID id) {
        return projetoRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Projeto nao encontrado"));
    }
}
