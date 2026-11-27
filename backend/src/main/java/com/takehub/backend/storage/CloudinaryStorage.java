package com.takehub.backend.storage;

import com.takehub.backend.common.exception.ApiException;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpRequest.BodyPublisher;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.HexFormat;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

/**
 * Upload assinado para o Cloudinary via API REST.
 * Credenciais vem de CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET.
 */
@Component
public class CloudinaryStorage implements ArquivoStorage {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryStorage.class);
    private static final String API = "https://api.cloudinary.com/v1_1/";

    private final String cloudName;
    private final String apiKey;
    private final String apiSecret;
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(15)).build();

    public CloudinaryStorage(@Value("${takehub.cloudinary.cloud-name:}") String cloudName,
                             @Value("${takehub.cloudinary.api-key:}") String apiKey,
                             @Value("${takehub.cloudinary.api-secret:}") String apiSecret) {
        this.cloudName = cloudName;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }

    @Override
    public ArquivoArmazenado enviar(MultipartFile arquivo, String pasta) {
        exigirConfigurado();
        String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
        String publicId = UUID.randomUUID().toString();
        Map<String, String> assinados = new TreeMap<>(Map.of(
                "folder", pasta, "public_id", publicId, "timestamp", timestamp));

        String boundary = "----takehub" + UUID.randomUUID();
        Map<String, String> campos = new TreeMap<>(assinados);
        campos.put("api_key", apiKey);
        campos.put("signature", assinar(assinados));

        var partes = new java.util.ArrayList<BodyPublisher>();
        campos.forEach((k, v) -> partes.add(BodyPublishers.ofString(
                "--" + boundary + "\r\nContent-Disposition: form-data; name=\"" + k + "\"\r\n\r\n" + v + "\r\n")));
        String nome = limpar(arquivo.getOriginalFilename());
        String tipo = arquivo.getContentType() == null ? "application/octet-stream" : arquivo.getContentType();
        partes.add(BodyPublishers.ofString("--" + boundary + "\r\nContent-Disposition: form-data; name=\"file\"; "
                + "filename=\"" + nome + "\"\r\nContent-Type: " + tipo + "\r\n\r\n"));
        partes.add(BodyPublishers.ofInputStream(() -> {
            try {
                return arquivo.getInputStream();
            } catch (IOException e) {
                throw new java.io.UncheckedIOException(e);
            }
        }));
        partes.add(BodyPublishers.ofString("\r\n--" + boundary + "--\r\n"));

        HttpRequest request = HttpRequest.newBuilder(URI.create(API + cloudName + "/video/upload"))
                .timeout(Duration.ofMinutes(10))
                .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                .POST(BodyPublishers.concat(partes.toArray(BodyPublisher[]::new)))
                .build();
        try {
            HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
            String json = response.body();
            if (response.statusCode() != 200) {
                String motivo = campo(json, "message");
                if (motivo == null) motivo = "erro desconhecido";
                log.error("Cloudinary recusou o upload ({}): {}", response.statusCode(), motivo);
                throw new ApiException(HttpStatus.BAD_GATEWAY, "Falha no upload do video: " + motivo);
            }
            String url = campo(json, "secure_url");
            String id = campo(json, "public_id");
            if (url == null || id == null) {
                throw new ApiException(HttpStatus.BAD_GATEWAY, "Resposta invalida do armazenamento de videos");
            }
            String bytes = campo(json, "bytes");
            return new ArquivoArmazenado(url, id, bytes == null ? arquivo.getSize() : Long.parseLong(bytes));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Upload do video interrompido");
        } catch (IOException | java.io.UncheckedIOException e) {
            log.error("Erro de comunicacao com o Cloudinary", e);
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Nao foi possivel enviar o video ao armazenamento");
        }
    }

    @Override
    public void remover(String publicId) {
        if (publicId == null || publicId.isBlank() || !configurado()) return;
        String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
        Map<String, String> assinados = new TreeMap<>(Map.of(
                "invalidate", "true", "public_id", publicId, "timestamp", timestamp));
        String form = "invalidate=true&public_id=" + enc(publicId) + "&timestamp=" + timestamp
                + "&api_key=" + enc(apiKey) + "&signature=" + assinar(assinados);
        try {
            HttpResponse<String> response = http.send(HttpRequest.newBuilder(URI.create(API + cloudName + "/video/destroy"))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .timeout(Duration.ofSeconds(30))
                    .POST(BodyPublishers.ofString(form)).build(), HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200 || !"ok".equals(campo(response.body(), "result"))) {
                log.warn("Cloudinary nao removeu {}: {} {}", publicId, response.statusCode(), response.body());
            }
        } catch (IOException e) {
            log.warn("Nao foi possivel remover {} do Cloudinary", publicId, e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private String assinar(Map<String, String> params) {
        StringBuilder base = new StringBuilder();
        params.forEach((k, v) -> base.append(base.isEmpty() ? "" : "&").append(k).append('=').append(v));
        try {
            byte[] hash = MessageDigest.getInstance("SHA-1")
                    .digest((base + apiSecret).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    private boolean configurado() {
        return !cloudName.isBlank() && !apiKey.isBlank() && !apiSecret.isBlank();
    }

    private void exigirConfigurado() {
        if (!configurado()) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Armazenamento de videos nao configurado (defina as variaveis CLOUDINARY_*)");
        }
    }

    /** Extrai um campo simples (string ou numero) do JSON de resposta do Cloudinary. */
    private static String campo(String json, String nome) {
        java.util.regex.Matcher m = java.util.regex.Pattern
                .compile("\"" + nome + "\"\\s*:\\s*(?:\"((?:[^\"\\\\]|\\\\.)*)\"|(\\d+))").matcher(json);
        if (!m.find()) return null;
        String valor = m.group(1) != null ? m.group(1) : m.group(2);
        return valor.replace("\\/", "/");
    }

    private static String enc(String v) {
        return URLEncoder.encode(v, StandardCharsets.UTF_8);
    }

    private static String limpar(String nome) {
        String base = nome == null || nome.isBlank() ? "video" : nome;
        return base.replaceAll("[\\r\\n\"\\\\]", "_");
    }
}
