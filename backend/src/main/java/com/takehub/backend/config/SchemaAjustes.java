package com.takehub.backend.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Ajustes de schema que o ddl-auto=update do Hibernate nao faz sozinho.
 * Os comandos sao idempotentes e rodam a cada inicializacao.
 */
@Component
public class SchemaAjustes implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    public SchemaAjustes(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        // Clientes cadastrados pelo editor ficam sem senha ate ativarem a conta.
        jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN senha_hash DROP NOT NULL");
    }
}
