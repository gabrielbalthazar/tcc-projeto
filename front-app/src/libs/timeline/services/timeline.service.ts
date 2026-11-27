import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { API_URL } from '../../core/api.config';
import { TimelineProjeto } from '../../core/models/timeline.model';
import { Projeto } from '../../core/models/projeto.model';
import { Versao } from '../../core/models/aprovacao.model';

@Injectable({ providedIn: 'root' })
export class TimelineService {

  private readonly API = `${API_URL}/timeline`;
  constructor(
    private http: HttpClient,
  ) { }

  getTimeline(): Observable<TimelineProjeto[]> {
    return this.http.get<Projeto[]>(`${API_URL}/projetos`).pipe(
      switchMap(projetos => forkJoin(projetos.map(projeto =>
        this.http.get<Versao[]>(`${API_URL}/projetos/${projeto.id}/versoes`).pipe(
          map(versoes => this.toTimeline(projeto, versoes)),
        )))),
    );
  }

  private toTimeline(projeto: Projeto, versoes: Versao[]): TimelineProjeto {
    return {
      id: projeto.id, projeto: projeto.nome, cliente: projeto.cliente,
      status: !versoes.length ? 'sem_versao'
        : versoes[0].status === 'aprovada' ? 'aprovada'
        : versoes[0].status === 'ajustes_solicitados' ? 'rejeitada' : 'aguardando_revisao',
      eventos: versoes.map(v => ({
        id: v.id, tipo: 'versao', titulo: `Versão ${v.numero}`,
        status: v.status === 'aprovada' ? 'aprovada'
          : v.status === 'ajustes_solicitados' ? 'rejeitada' : 'aguardando_revisao',
        data: new Date(v.criadaEm),
        arquivo: { nome: v.nomeArquivo, enviadoPor: v.enviadoPor },
        comentario: v.comentarioCliente ? { mensagem: v.comentarioCliente, autor: projeto.cliente } : undefined,
      })),
    };
  }
}
