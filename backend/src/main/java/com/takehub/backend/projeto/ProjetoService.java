package com.takehub.backend.projeto;

import com.takehub.backend.common.exception.ApiException;
import com.takehub.backend.projeto.dto.CreateProjetoRequest;
import com.takehub.backend.projeto.dto.ProjetoResponse;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ProjetoService {

    private final ProjetoRepository projetoRepository;

    public ProjetoService(ProjetoRepository projetoRepository) {
        this.projetoRepository = projetoRepository;
    }

    public List<ProjetoResponse> getProjetos() {
        return projetoRepository.findAll().stream()
                .map(ProjetoResponse::from)
                .toList();
    }

    public ProjetoResponse createProjeto(CreateProjetoRequest request) {
        Projeto projeto = new Projeto();
        projeto.setNome(request.nome());
        projeto.setDescricao(request.descricao());
        projeto.setCliente(request.cliente());
        projeto.setEditor(request.editor());
        projeto.setPrazo(request.prazo());
        projeto.setStatus(ProjetoStatus.RASCUNHO);
        projeto.setProgresso(0);

        projetoRepository.save(projeto);
        return ProjetoResponse.from(projeto);
    }

    public ProjetoResponse enviarAoCliente(UUID id) {
        Projeto projeto = findOrThrow(id);
        projeto.setStatus(ProjetoStatus.EM_REVISAO);
        projetoRepository.save(projeto);
        return ProjetoResponse.from(projeto);
    }

    private Projeto findOrThrow(UUID id) {
        return projetoRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Projeto nao encontrado"));
    }
}
