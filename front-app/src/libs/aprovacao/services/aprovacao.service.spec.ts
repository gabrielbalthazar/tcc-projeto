import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AprovacaoService } from './aprovacao.service';
import { ProjetosService } from '../../projetos/services/projetos.service';
import { API_URL } from '../../core/api.config';

describe('AprovacaoService', () => {
  let service: AprovacaoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AprovacaoService,
        ProjetosService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AprovacaoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('uses the latest project version as the approval material', () => {
    let result: any;
    service.getMaterial('p1').subscribe(material => result = material);

    http.expectOne(`${API_URL}/projetos/p1`).flush({
      id: 'p1', nome: 'Projeto', cliente: 'Cliente', editor: 'Editor',
      status: 'em_revisao', progresso: 0, prazo: '2026-12-01', descricao: '',
    });
    http.expectOne(`${API_URL}/projetos/p1/versoes`).flush([{
      id: 'v2', projetoId: 'p1', numero: 2, nomeArquivo: 'video-v2.mp4',
      arquivoUrl: '/api/versoes/v2/arquivo', tamanhoArquivo: 10,
      status: 'aguardando_revisao', enviadoPor: 'Editor',
      criadaEm: '2026-11-16T12:00:00', mensagemEditor: 'Correções aplicadas',
    }, {
      id: 'v1', projetoId: 'p1', numero: 1, nomeArquivo: 'video-v1.mp4',
      arquivoUrl: '/api/versoes/v1/arquivo', tamanhoArquivo: 10,
      status: 'ajustes_solicitados', enviadoPor: 'Editor',
      criadaEm: '2026-11-15T12:00:00', avaliadaEm: '2026-11-15T13:00:00',
      comentarioCliente: 'Ajustar a introdução',
    }]);

    expect(result.versaoAtual).toBe(2);
    expect(result.arquivo.nome).toBe('video-v2.mp4');
    expect(result.historico[0].comentario).toBe('Ajustar a introdução');
  });
});
