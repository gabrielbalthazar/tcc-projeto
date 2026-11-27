import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TimelineService } from './timeline.service';
import { API_URL } from '../../core/api.config';

describe('TimelineService', () => {
  let service: TimelineService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimelineService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TimelineService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads project versions as timeline events', () => {
    let result: any;
    service.getTimeline().subscribe(timeline => result = timeline);

    http.expectOne(`${API_URL}/projetos`).flush([{
      id: 'p1', nome: 'Projeto', cliente: 'Cliente', editor: 'Editor',
      status: 'em_revisao', progresso: 0, prazo: '2026-12-01',
      descricao: '',
    }]);
    http.expectOne(`${API_URL}/projetos/p1/versoes`).flush([{
      id: 'v1', projetoId: 'p1', numero: 1, nomeArquivo: 'video.mp4',
      arquivoUrl: '/api/versoes/v1/arquivo', tamanhoArquivo: 10,
      status: 'aguardando_revisao', enviadoPor: 'Editor',
      criadaEm: '2026-11-16T12:00:00',
    }]);

    expect(result[0].eventos[0].titulo).toBe('Versão 1');
    expect(result[0].eventos[0].status).toBe('aguardando_revisao');
  });

  it('sends a video as multipart form data', () => {
    const file = new File(['video'], 'video.mp4', { type: 'video/mp4' });
    service.enviarVersao('p1', file, 'Mensagem').subscribe();

    const request = http.expectOne(`${API_URL}/projetos/p1/versoes`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body.get('arquivo')).toBe(file);
    expect(request.request.body.get('mensagem')).toBe('Mensagem');
  });
});
