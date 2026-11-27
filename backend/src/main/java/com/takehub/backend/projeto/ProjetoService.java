package com.takehub.backend.projeto;

import com.takehub.backend.auth.User;
import com.takehub.backend.auth.UserRole;
import com.takehub.backend.cliente.ClienteRepository;
import com.takehub.backend.common.exception.ApiException;
import com.takehub.backend.storage.ArquivoStorage;
import com.takehub.backend.versao.Versao;
import com.takehub.backend.versao.VersaoRepository;
import com.takehub.backend.versao.VersaoStatus;
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
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
public class ProjetoService {

    private final ProjetoRepository projetoRepository;
    private final TarefaRepository tarefaRepository;
    private final UsuarioService usuarioService;
    private final ClienteRepository clienteRepository;

    private final VersaoRepository versaoRepository;
    private final ArquivoStorage storage;

    public ProjetoService(
            ProjetoRepository projetoRepository,
            TarefaRepository tarefaRepository,
            UsuarioService usuarioService,
            ClienteRepository clienteRepository,
            VersaoRepository versaoRepository,
            ArquivoStorage storage) {
        this.projetoRepository = projetoRepository;
        this.tarefaRepository = tarefaRepository;
        this.usuarioService = usuarioService;
        this.clienteRepository = clienteRepository;
        this.versaoRepository = versaoRepository;
        this.storage = storage;
    }

    public List<ProjetoResponse> getProjetos(User usuarioLogado) {
        List<Projeto> projetos = usuarioLogado.getTipo() == UserRole.CLIENTE
                ? projetoRepository.findByClienteAndStatusNotOrderByPrazoAsc(usuarioLogado, ProjetoStatus.RASCUNHO)
                : projetoRepository.findByEditorOrderByPrazoAsc(usuarioLogado);

        return projetos.stream().map(ProjetoResponse::from).toList();
    }

    public ProjetoResponse getProjeto(UUID id, User usuarioLogado) {
        return ProjetoResponse.from(findAccessible(id, usuarioLogado));
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
        recalcularProgresso(projeto);

        projetoRepository.save(projeto);
        return ProjetoResponse.from(projeto);
    }

    @Transactional
    public void deleteProjeto(UUID id, User editor) {
        Projeto projeto = findDoEditor(id, editor);
        List<String> videos = versaoRepository.findByProjetoOrderByNumeroDesc(projeto).stream()
                .map(Versao::getPublicId)
                .toList();
        tarefaRepository.deleteByProjeto(projeto);
        projetoRepository.delete(projeto);
        // So apaga no Cloudinary depois que a exclusao no banco for confirmada.
        aposCommit(() -> videos.forEach(storage::remover));
    }

    private static void aposCommit(Runnable acao) {
        if (!TransactionSynchronizationManager.isSynchronizationActive()) {
            acao.run();
            return;
        }
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                acao.run();
            }
        });
    }

    public ProjetoResponse enviarAoCliente(UUID id, User editor) {
        Projeto projeto = findDoEditor(id, editor);
        boolean temVideoPendente = versaoRepository.findFirstByProjetoOrderByNumeroDesc(projeto)
                .filter(v -> v.getStatus() == VersaoStatus.AGUARDANDO_REVISAO)
                .isPresent();
        if (!temVideoPendente) {
            throw new ApiException(HttpStatus.CONFLICT, "Envie uma nova versão do vídeo pela Timeline antes de enviar ao cliente.");
        }
        projeto.setStatus(ProjetoStatus.EM_REVISAO);
        projetoRepository.save(projeto);
        return ProjetoResponse.from(projeto);
    }

    public Projeto findAccessible(UUID id, User usuario) {
        if (usuario.getTipo() == UserRole.EDITOR) {
            return findDoEditor(id, usuario);
        }
        return projetoRepository.findById(id)
                .filter(p -> p.getCliente().getId().equals(usuario.getId()))
                .filter(p -> p.getStatus() != ProjetoStatus.RASCUNHO)
                .orElseThrow(ProjetoService::naoEncontrado);
    }

    public void recalcularProgresso(Projeto projeto) {
        long total = tarefaRepository.countByProjeto(projeto);
        long concluidas = tarefaRepository.countByProjetoAndStatus(projeto, com.takehub.backend.tarefa.TarefaStatus.CONCLUIDO);
        projeto.setProgresso(total == 0 ? 0 : (int) Math.round(concluidas * 100.0 / total));
        projetoRepository.save(projeto);
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
