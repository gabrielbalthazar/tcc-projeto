package com.takehub.backend.cliente;

import com.takehub.backend.auth.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, UUID> {

    List<Cliente> findByEditorOrderByNomeAsc(User editor);

    Optional<Cliente> findByIdAndEditor(UUID id, User editor);

    boolean existsByEditorAndUsuario(User editor, User usuario);

    long countByUsuario(User usuario);
}
