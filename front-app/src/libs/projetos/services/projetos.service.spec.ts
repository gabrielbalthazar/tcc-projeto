import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProjetosService } from './projetos.service';
import { API_URL } from '../../core/api.config';

describe('ProjetosService', () => {
  let service: ProjetosService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjetosService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProjetosService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('sends a video as multipart form data with upload progress', () => {
    const file = new File(['video'], 'video.mp4', { type: 'video/mp4' });
    service.enviarVersao('p1', file, 'Mensagem').subscribe();

    const request = http.expectOne(`${API_URL}/projetos/p1/versoes`);
    expect(request.request.method).toBe('POST');
    expect(request.request.reportProgress).toBe(true);
    expect(request.request.body.get('arquivo')).toBe(file);
    expect(request.request.body.get('mensagem')).toBe('Mensagem');
  });

  it('loads the versions of a project for the revision history', () => {
    let result: any;
    service.getVersoes('p1').subscribe(versoes => result = versoes);

    const request = http.expectOne(`${API_URL}/projetos/p1/versoes`);
    expect(request.request.method).toBe('GET');
    request.flush([{ id: 'v1', numero: 1, mensagemEditor: 'Primeira versão', comentarioCliente: 'Ajustar a trilha' }]);

    expect(result[0].comentarioCliente).toBe('Ajustar a trilha');
  });
});
