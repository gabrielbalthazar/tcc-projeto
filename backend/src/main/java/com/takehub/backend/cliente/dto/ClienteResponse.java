package com.takehub.backend.cliente.dto;

import com.takehub.backend.cliente.Cliente;

public record ClienteResponse(
        String id,
        String usuarioId,
        String nome,
        String empresa,
        String email,
        String telefone,
        String observacoes,
        long projetosAtivos,
        boolean cadastroPendente,
        boolean emailEditavel
) {
    public static ClienteResponse from(Cliente cliente, long projetosAtivos, boolean emailEditavel) {
        return new ClienteResponse(
                cliente.getId().toString(),
                cliente.getUsuario().getId().toString(),
                cliente.getNome(),
                cliente.getEmpresa(),
                cliente.getUsuario().getEmail(),
                cliente.getTelefone(),
                cliente.getObservacoes(),
                projetosAtivos,
                cliente.getUsuario().isCadastroPendente(),
                emailEditavel
        );
    }
}
