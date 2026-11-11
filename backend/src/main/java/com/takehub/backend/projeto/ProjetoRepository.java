package com.takehub.backend.projeto;

import com.takehub.backend.auth.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjetoRepository extends JpaRepository<Projeto, UUID> {

    long countByEditorAndStatus(User editor, ProjetoStatus status);

    List<Projeto> findByClienteOrderByPrazoAsc(User cliente);

    List<Projeto> findByEditorOrderByPrazoAsc(User editor);

    Optional<Projeto> findByIdAndEditor(UUID id, User editor);

    long countByClienteAndEditorAndStatusNotIn(User cliente, User editor, List<ProjetoStatus> status);

    /** Cada linha: [UUID clienteId, Long quantidade] de projetos do editor fora dos status informados. */
    @Query("select p.cliente.id, count(p) from Projeto p"
            + " where p.editor = :editor and p.status not in :status group by p.cliente.id")
    List<Object[]> countAtivosPorCliente(@Param("editor") User editor, @Param("status") List<ProjetoStatus> status);
}
