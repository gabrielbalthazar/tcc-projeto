package com.takehub.backend.versao;

import com.takehub.backend.auth.User;
import com.takehub.backend.projeto.Projeto;
import com.takehub.backend.projeto.ProjetoService;
import com.takehub.backend.projeto.ProjetoStatus;
import com.takehub.backend.versao.dto.AvaliacaoVersaoRequest;
import com.takehub.backend.versao.dto.VersaoResponse;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.takehub.backend.common.exception.ApiException;
import com.takehub.backend.storage.ArquivoStorage;

@Service
public class VersaoService {
    private static final long TAMANHO_MAXIMO = 100L * 1024 * 1024; // limite do plano gratuito do Cloudinary

    private final VersaoRepository repository;
    private final ProjetoService projetoService;
    private final ArquivoStorage storage;

    public VersaoService(VersaoRepository repository, ProjetoService projetoService, ArquivoStorage storage) {
        this.repository = repository;
        this.projetoService = projetoService;
        this.storage = storage;
    }

    public List<VersaoResponse> listar(UUID projetoId, User usuario) {
        Projeto projeto = projetoService.findAccessible(projetoId, usuario);
        return repository.findByProjetoOrderByNumeroDesc(projeto).stream().map(VersaoResponse::from).toList();
    }

    @Transactional
    public VersaoResponse criar(UUID projetoId, MultipartFile arquivo, String mensagem, User editor) {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Arquivo de video e obrigatorio");
        }
        if (arquivo.getContentType() == null || !arquivo.getContentType().startsWith("video/")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "O arquivo enviado precisa ser um video");
        }
        if (arquivo.getSize() > TAMANHO_MAXIMO) {
            throw new ApiException(HttpStatus.PAYLOAD_TOO_LARGE, "O video excede o limite de 100 MB");
        }
        Projeto projeto = projetoService.findDoEditor(projetoId, editor);
        ArquivoStorage.ArquivoArmazenado salvo = storage.enviar(arquivo, "takehub/projetos/" + projeto.getId());

        Versao versao = new Versao();
        versao.setProjeto(projeto);
        versao.setNumero(repository.countByProjeto(projeto) + 1);
        versao.setNomeArquivo(Path.of(arquivo.getOriginalFilename() == null ? "video" : arquivo.getOriginalFilename())
                .getFileName().toString());
        versao.setArquivoUrl(salvo.url());
        versao.setPublicId(salvo.publicId());
        versao.setTipoArquivo(arquivo.getContentType());
        versao.setTamanhoArquivo(salvo.bytes());
        versao.setMensagemEditor(mensagem == null ? "" : mensagem);
        versao.setStatus(VersaoStatus.AGUARDANDO_REVISAO);
        versao.setEnviadoPor(editor);
        versao.setCriadaEm(LocalDateTime.now());
        projeto.setStatus(ProjetoStatus.EM_REVISAO);
        try {
            repository.save(versao);
        } catch (RuntimeException e) {
            storage.remover(salvo.publicId());
            throw e;
        }
        return VersaoResponse.from(versao);
    }

    @Transactional
    public VersaoResponse avaliar(UUID id, AvaliacaoVersaoRequest request, User cliente) {
        Versao versao = repository.findByIdAndProjetoCliente(id, cliente)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Versao nao encontrada"));
        if (versao.getStatus() != VersaoStatus.AGUARDANDO_REVISAO) {
            throw new ApiException(HttpStatus.CONFLICT, "Esta versao ja foi avaliada");
        }
        boolean aprovar = "aprovar".equalsIgnoreCase(request.decisao());
        if (!aprovar && !"ajustes".equalsIgnoreCase(request.decisao())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Decisao invalida");
        }
        versao.setStatus(aprovar ? VersaoStatus.APROVADA : VersaoStatus.AJUSTES_SOLICITADOS);
        versao.setComentarioCliente(request.comentario());
        versao.setAvaliadaEm(LocalDateTime.now());
        Projeto projeto = versao.getProjeto();
        projeto.setStatus(aprovar ? ProjetoStatus.APROVADO : ProjetoStatus.EM_ANDAMENTO);
        if (aprovar) {
            projeto.setFeedbackAutor(null);
            projeto.setFeedbackVersao(null);
            projeto.setFeedbackData(null);
            projeto.setFeedbackMensagem(null);
        } else {
            projeto.setFeedbackAutor(cliente.getNome());
            projeto.setFeedbackVersao("v" + versao.getNumero());
            projeto.setFeedbackData(java.time.LocalDate.now());
            projeto.setFeedbackMensagem(request.comentario());
            projeto.setFeedbackRejeicoes((projeto.getFeedbackRejeicoes() == null ? 0 : projeto.getFeedbackRejeicoes()) + 1);
        }
        return VersaoResponse.from(repository.save(versao));
    }
}
