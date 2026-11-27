package com.takehub.backend.versao;

import com.takehub.backend.auth.User;
import com.takehub.backend.projeto.Projeto;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VersaoRepository extends JpaRepository<Versao, UUID> {
    List<Versao> findByProjetoOrderByNumeroDesc(Projeto projeto);
    Optional<Versao> findFirstByProjetoOrderByNumeroDesc(Projeto projeto);
    Optional<Versao> findByIdAndProjetoEditor(UUID id, User editor);
    Optional<Versao> findByIdAndProjetoCliente(UUID id, User cliente);
    int countByProjeto(Projeto projeto);
}
