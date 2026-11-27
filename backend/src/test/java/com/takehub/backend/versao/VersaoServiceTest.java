package com.takehub.backend.versao;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.takehub.backend.auth.User;
import com.takehub.backend.auth.UserRole;
import com.takehub.backend.projeto.Projeto;
import com.takehub.backend.projeto.ProjetoService;
import com.takehub.backend.projeto.ProjetoStatus;
import com.takehub.backend.versao.dto.AvaliacaoVersaoRequest;
import com.takehub.backend.storage.ArquivoStorage;
import com.takehub.backend.versao.dto.VersaoResponse;
import com.takehub.backend.common.exception.ApiException;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import org.mockito.ArgumentCaptor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.mock.web.MockMultipartFile;

@ExtendWith(MockitoExtension.class)
class VersaoServiceTest {

    @Mock
    private VersaoRepository repository;

    @Mock
    private ProjetoService projetoService;

    @Mock
    private ArquivoStorage storage;

    private User editor;
    private User cliente;
    private Projeto projeto;
    private VersaoService service;

    @BeforeEach
    void setUp() {
        editor = user("Editor", UserRole.EDITOR);
        cliente = user("Cliente", UserRole.CLIENTE);
        projeto = new Projeto();
        projeto.setId(UUID.randomUUID());
        projeto.setNome("Projeto de teste");
        projeto.setEditor(editor);
        projeto.setCliente(cliente);
        projeto.setStatus(ProjetoStatus.EM_ANDAMENTO);
        projeto.setProgresso(0);
        service = new VersaoService(repository, projetoService, storage);
    }

    @Test
    void createsVersionAndStoresVideoMetadata() throws Exception {
        when(projetoService.findDoEditor(projeto.getId(), editor)).thenReturn(projeto);
        when(repository.countByProjeto(projeto)).thenReturn(2);
        when(storage.enviar(any(), any())).thenReturn(
                new ArquivoStorage.ArquivoArmazenado("https://res.cloudinary.com/x/video.mp4", "takehub/id", 3));
        when(repository.save(any(Versao.class))).thenAnswer(invocation -> {
            Versao saved = invocation.getArgument(0);
            saved.setId(UUID.randomUUID());
            return saved;
        });

        MockMultipartFile video = new MockMultipartFile(
                "arquivo", "video.mp4", "video/mp4", new byte[] {1, 2, 3});
        VersaoResponse response = service.criar(projeto.getId(), video, "Nova edição", editor);

        assertEquals(3, response.numero());
        assertEquals("video.mp4", response.nomeArquivo());
        assertEquals(VersaoStatus.AGUARDANDO_REVISAO, response.status());
        assertEquals(ProjetoStatus.EM_REVISAO, projeto.getStatus());
        verify(repository).save(any(Versao.class));
        ArgumentCaptor<Versao> captor = ArgumentCaptor.forClass(Versao.class);
        verify(repository).save(captor.capture());
        assertEquals("https://res.cloudinary.com/x/video.mp4", captor.getValue().getArquivoUrl());
        assertEquals("takehub/id", captor.getValue().getPublicId());
    }

    @Test
    void approvalChangesProjectStatus() {
        Versao versao = version();
        when(repository.findByIdAndProjetoCliente(versao.getId(), cliente)).thenReturn(Optional.of(versao));
        when(repository.save(versao)).thenReturn(versao);

        VersaoResponse response = service.avaliar(
                versao.getId(), new AvaliacaoVersaoRequest("aprovar", "Tudo certo"), cliente);

        assertEquals(VersaoStatus.APROVADA, response.status());
        assertEquals(ProjetoStatus.APROVADO, projeto.getStatus());
        assertEquals("Tudo certo", versao.getComentarioCliente());
    }

    @Test
    void adjustmentRequestUpdatesProjectFeedback() {
        Versao versao = version();
        when(repository.findByIdAndProjetoCliente(versao.getId(), cliente)).thenReturn(Optional.of(versao));
        when(repository.save(versao)).thenReturn(versao);

        service.avaliar(versao.getId(),
                new AvaliacaoVersaoRequest("ajustes", "Reduzir a introdução"), cliente);

        assertEquals(VersaoStatus.AJUSTES_SOLICITADOS, versao.getStatus());
        assertEquals(ProjetoStatus.EM_ANDAMENTO, projeto.getStatus());
        assertEquals("Reduzir a introdução", projeto.getFeedbackMensagem());
        assertEquals("Cliente", projeto.getFeedbackAutor());
        assertEquals("v1", projeto.getFeedbackVersao());
        assertEquals(LocalDate.now(), projeto.getFeedbackData());
    }

    @Test
    void rejectsNonVideoFile() {
        MockMultipartFile txt = new MockMultipartFile("arquivo", "a.txt", "text/plain", new byte[] {1});
        assertThrows(ApiException.class, () -> service.criar(projeto.getId(), txt, "", editor));
        verifyNoInteractions(storage);
    }

    @Test
    void rejectsUnsupportedVideoFormat() {
        MockMultipartFile avi = new MockMultipartFile("arquivo", "video.avi", "video/x-msvideo", new byte[] {1});
        assertThrows(ApiException.class, () -> service.criar(projeto.getId(), avi, "", editor));
        verifyNoInteractions(storage);
    }

    @Test
    void cannotEvaluateTwice() {
        Versao versao = version();
        versao.setStatus(VersaoStatus.APROVADA);
        when(repository.findByIdAndProjetoCliente(versao.getId(), cliente)).thenReturn(Optional.of(versao));
        assertThrows(ApiException.class, () -> service.avaliar(
                versao.getId(), new AvaliacaoVersaoRequest("ajustes", "x"), cliente));
    }

    private Versao version() {
        Versao versao = new Versao();
        versao.setId(UUID.randomUUID());
        versao.setProjeto(projeto);
        versao.setNumero(1);
        versao.setNomeArquivo("video.mp4");
        versao.setArquivoUrl("https://res.cloudinary.com/x/video.mp4");
        versao.setEnviadoPor(editor);
        versao.setCriadaEm(java.time.LocalDateTime.now());
        versao.setStatus(VersaoStatus.AGUARDANDO_REVISAO);
        return versao;
    }

    private static User user(String nome, UserRole role) {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setNome(nome);
        user.setEmail(nome.toLowerCase() + "@example.com");
        user.setTipo(role);
        return user;
    }
}
