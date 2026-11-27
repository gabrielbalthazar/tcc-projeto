package com.takehub.backend.tarefa;

import com.takehub.backend.auth.User;
import com.takehub.backend.projeto.Projeto;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TarefaRepository extends JpaRepository<Tarefa, UUID> {

    long countByProjetoEditorAndStatus(User editor, TarefaStatus status);

    List<Tarefa> findByProjetoEditor(User editor);

    Optional<Tarefa> findByIdAndProjetoEditor(UUID id, User editor);

    void deleteByProjeto(Projeto projeto);
}
