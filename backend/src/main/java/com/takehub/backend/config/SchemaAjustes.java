package com.takehub.backend.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import com.takehub.backend.projeto.ProjetoService;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Ajustes de schema que o ddl-auto=update do Hibernate nao faz sozinho.
 * Os comandos sao idempotentes e rodam a cada inicializacao.
 */
@Component
public class SchemaAjustes implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;
    private final ProjetoService projetoService;

    public SchemaAjustes(JdbcTemplate jdbcTemplate, ProjetoService projetoService) {
        this.jdbcTemplate = jdbcTemplate;
        this.projetoService = projetoService;
    }

    @Override
    public void run(ApplicationArguments args) {
        // Clientes cadastrados pelo editor ficam sem senha ate ativarem a conta.
        jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN senha_hash DROP NOT NULL");
        // Videos antes ficavam em disco local; agora ficam no Cloudinary (arquivo_url).
        jdbcTemplate.execute("ALTER TABLE versoes DROP COLUMN IF EXISTS caminho_arquivo");
        jdbcTemplate.execute("ALTER TABLE projetos DROP CONSTRAINT IF EXISTS projetos_status_check");
        projetoService.recalcularProgressoDeTodos();
    }
}
