package com.takehub.backend.storage;

import org.springframework.web.multipart.MultipartFile;

/** Abstracao do armazenamento de arquivos de video (implementada pelo Cloudinary). */
public interface ArquivoStorage {

    ArquivoArmazenado enviar(MultipartFile arquivo, String pasta);

    /** Remocao em melhor esforco: falhas nao interrompem o fluxo de negocio. */
    void remover(String publicId);

    record ArquivoArmazenado(String url, String publicId, long bytes) { }
}
