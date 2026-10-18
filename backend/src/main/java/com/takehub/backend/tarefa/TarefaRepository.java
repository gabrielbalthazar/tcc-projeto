package com.takehub.backend.tarefa;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TarefaRepository extends JpaRepository<Tarefa, UUID> {

    long countByStatus(TarefaStatus status);
}
