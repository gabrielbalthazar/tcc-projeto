package com.takehub.backend.projeto;

import static org.mockito.Mockito.*;

import com.takehub.backend.auth.User;
import com.takehub.backend.auth.UserRole;
import com.takehub.backend.tarefa.TarefaRepository;
import com.takehub.backend.cliente.ClienteRepository;
import com.takehub.backend.storage.ArquivoStorage;
import com.takehub.backend.versao.Versao;
import com.takehub.backend.versao.VersaoRepository;
import com.takehub.backend.versao.VersaoStatus;
import com.takehub.backend.common.exception.ApiException;
import com.takehub.backend.projeto.dto.UpdateProjetoRequest;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import com.takehub.backend.usuario.UsuarioService;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProjetoServiceTest {

    @Mock
    private ProjetoRepository projetoRepository;
    @Mock
    private TarefaRepository tarefaRepository;
    @Mock
    private UsuarioService usuarioService;
    @Mock
    private ClienteRepository clienteRepository;
    @Mock
    private VersaoRepository versaoRepository;
    @Mock
    private ArquivoStorage storage;

    @Test
    void progressStartsAtTenPercentWithoutDeliveries() {
        org.junit.jupiter.api.Assertions.assertEquals(10, ProjetoService.calcularProgresso(List.of()));
    }

    @Test
    void progressFollowsDeliveriesAndAdjustments() {
        org.junit.jupiter.api.Assertions.assertEquals(30, ProjetoService.calcularProgresso(List.of(
                versao(1, VersaoStatus.AGUARDANDO_REVISAO))));
        org.junit.jupiter.api.Assertions.assertEquals(35, ProjetoService.calcularProgresso(List.of(
                versao(1, VersaoStatus.AJUSTES_SOLICITADOS))));
        org.junit.jupiter.api.Assertions.assertEquals(45, ProjetoService.calcularProgresso(List.of(
                versao(2, VersaoStatus.AGUARDANDO_REVISAO),
                versao(1, VersaoStatus.AJUSTES_SOLICITADOS))));
    }

    @Test
    void progressNeverReachesHundredWithoutApproval() {
        List<Versao> versoes = java.util.stream.IntStream.rangeClosed(1, 10)
                .mapToObj(n -> versao(n, VersaoStatus.AJUSTES_SOLICITADOS))
                .toList();
        org.junit.jupiter.api.Assertions.assertEquals(95, ProjetoService.calcularProgresso(versoes));
    }

    @Test
    void approvedProjectIsComplete() {
        org.junit.jupiter.api.Assertions.assertEquals(100, ProjetoService.calcularProgresso(List.of(
                versao(1, VersaoStatus.APROVADA))));
    }

    @Test
    void recalculatesProgressFromVersions() {
        ProjetoService service = new ProjetoService(
                projetoRepository, tarefaRepository, usuarioService, clienteRepository,
                versaoRepository, storage);
        Projeto projeto = new Projeto();
        when(versaoRepository.findByProjetoOrderByNumeroDesc(projeto)).thenReturn(List.of(
                versao(1, VersaoStatus.AJUSTES_SOLICITADOS)));

        service.recalcularProgresso(projeto);

        org.junit.jupiter.api.Assertions.assertEquals(35, projeto.getProgresso());
        verify(projetoRepository).save(projeto);
    }

    private static Versao versao(int numero, VersaoStatus status) {
        Versao versao = new Versao();
        versao.setNumero(numero);
        versao.setStatus(status);
        return versao;
    }

    @Test
    void editorCannotSetAutomaticStatusManually() {
        ProjetoService service = new ProjetoService(
                projetoRepository, tarefaRepository, usuarioService, clienteRepository,
                versaoRepository, storage);
        User editor = new User();
        User cliente = new User();
        cliente.setId(UUID.randomUUID());
        Projeto projeto = new Projeto();
        projeto.setId(UUID.randomUUID());
        projeto.setCliente(cliente);
        projeto.setStatus(ProjetoStatus.EM_ANDAMENTO);

        when(projetoRepository.findByIdAndEditor(projeto.getId(), editor)).thenReturn(Optional.of(projeto));

        UpdateProjetoRequest request = new UpdateProjetoRequest(
                "Projeto", cliente.getId(), LocalDate.now(), "", ProjetoStatus.APROVADO, 0);

        org.junit.jupiter.api.Assertions.assertThrows(ApiException.class,
                () -> service.updateProjeto(projeto.getId(), request, editor));
        org.junit.jupiter.api.Assertions.assertEquals(ProjetoStatus.EM_ANDAMENTO, projeto.getStatus());
    }

    @Test
    void deletingProjectRemovesItsVideos() {
        ProjetoService service = new ProjetoService(
                projetoRepository, tarefaRepository, usuarioService, clienteRepository,
                versaoRepository, storage);
        User editor = new User();
        Projeto projeto = new Projeto();
        projeto.setId(UUID.randomUUID());
        Versao versao = new Versao();
        versao.setPublicId("takehub/video-1");

        when(projetoRepository.findByIdAndEditor(projeto.getId(), editor)).thenReturn(Optional.of(projeto));
        when(versaoRepository.findByProjetoOrderByNumeroDesc(projeto)).thenReturn(List.of(versao));

        service.deleteProjeto(projeto.getId(), editor);

        verify(projetoRepository).delete(projeto);
        verify(storage).remover("takehub/video-1");
    }
}
