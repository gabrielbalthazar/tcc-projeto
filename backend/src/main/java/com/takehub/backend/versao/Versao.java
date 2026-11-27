package com.takehub.backend.versao;

import com.takehub.backend.auth.User;
import com.takehub.backend.projeto.Projeto;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "versoes")
@Getter
@Setter
@NoArgsConstructor
public class Versao {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "projeto_id", nullable = false)
    private Projeto projeto;

    @Column(nullable = false)
    private Integer numero;

    @Column(nullable = false)
    private String nomeArquivo;

    @Column(length = 1000)
    private String arquivoUrl;

    private String publicId;

    private String tipoArquivo;
    private Long tamanhoArquivo;

    @Column(columnDefinition = "TEXT")
    private String mensagemEditor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VersaoStatus status;

    @Column(columnDefinition = "TEXT")
    private String comentarioCliente;

    @ManyToOne(optional = false)
    @JoinColumn(name = "enviado_por_id", nullable = false)
    private User enviadoPor;

    @Column(nullable = false)
    private LocalDateTime criadaEm;

    private LocalDateTime avaliadaEm;
}
