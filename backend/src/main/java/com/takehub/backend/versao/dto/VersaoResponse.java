package com.takehub.backend.versao.dto;

import com.takehub.backend.versao.Versao;
import com.takehub.backend.versao.VersaoStatus;
import java.time.LocalDateTime;

public record VersaoResponse(
        String id, String projetoId, int numero, String nomeArquivo, String arquivoUrl,
        String tipoArquivo, long tamanhoArquivo, String mensagemEditor, VersaoStatus status,
        String comentarioCliente, String enviadoPor, LocalDateTime criadaEm, LocalDateTime avaliadaEm
) {
    public static VersaoResponse from(Versao v) {
        return new VersaoResponse(v.getId().toString(), v.getProjeto().getId().toString(), v.getNumero(),
                v.getNomeArquivo(), v.getArquivoUrl(), v.getTipoArquivo(),
                v.getTamanhoArquivo() == null ? 0 : v.getTamanhoArquivo(), v.getMensagemEditor(),
                v.getStatus(), v.getComentarioCliente(), v.getEnviadoPor().getNome(),
                v.getCriadaEm(), v.getAvaliadaEm());
    }
}
