package com.takehub.backend.projeto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "projetos")
@Getter
@Setter
@NoArgsConstructor
public class Projeto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false)
    private String cliente;

    @Column(nullable = false)
    private String editor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjetoStatus status;

    @Column(nullable = false)
    private Integer progresso;

    @Column(nullable = false)
    private LocalDate prazo;

    @Column(name = "feedback_autor")
    private String feedbackAutor;

    @Column(name = "feedback_versao")
    private String feedbackVersao;

    @Column(name = "feedback_data")
    private LocalDate feedbackData;

    @Column(name = "feedback_mensagem", columnDefinition = "TEXT")
    private String feedbackMensagem;

    @Column(name = "feedback_rejeicoes")
    private Integer feedbackRejeicoes;
}
