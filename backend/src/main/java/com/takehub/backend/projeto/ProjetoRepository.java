package com.takehub.backend.projeto;

import com.takehub.backend.auth.User;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjetoRepository extends JpaRepository<Projeto, UUID> {

    long countByStatus(ProjetoStatus status);

    List<Projeto> findByClienteOrderByPrazoAsc(User cliente);

    List<Projeto> findAllByOrderByPrazoAsc();
}
