package com.takehub.backend.projeto;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjetoRepository extends JpaRepository<Projeto, UUID> {

    long countByStatus(ProjetoStatus status);
}
