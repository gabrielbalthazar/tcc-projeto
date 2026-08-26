import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CreateProjetoPayload, Projeto } from '../../core/models/projeto.model';

@Injectable({ providedIn: 'root' })
export class ProjetosService {

  private readonly API = 'http://localhost:8080/api/projetos';
  private projetos: Projeto[] = this.getMockData();

  constructor(
    private http: HttpClient,
  ) { }

  getProjetos(): Observable<Projeto[]> {
    //return this.http.get<Projeto[]>(this.API);
    return of(this.projetos);
  }

  createProjeto(payload: CreateProjetoPayload): Observable<Projeto> {
    //return this.http.post<Projeto>(this.API, payload);
    const novo: Projeto = {
      id: String(this.projetos.length + 1),
      nome: payload.nome,
      descricao: payload.descricao,
      cliente: payload.cliente,
      editor: payload.editor,
      status: 'rascunho',
      progresso: 0,
      prazo: new Date(payload.prazo),
    };
    this.projetos = [novo, ...this.projetos];
    return of(novo);
  }

  enviarAoCliente(id: string): Observable<Projeto | undefined> {
    //return this.http.post<Projeto>(`${this.API}/${id}/enviar`, {});
    const projeto = this.projetos.find(p => p.id === id);
    if (projeto) {
      projeto.status = 'em_revisao';
    }
    return of(projeto);
  }

  private getMockData(): Projeto[] {
    return [
      {
        id: '1', nome: 'Campanha Verão 2026',
        descricao: 'Vídeo promocional para campanha de verão com 3 versões',
        cliente: 'Marca Sol', editor: 'Ana Silva',
        status: 'em_andamento', progresso: 65, prazo: new Date('2026-03-19'),
        feedback: {
          autor: 'Marca Sol - Marketing', versao: 'v1', data: new Date('2026-03-05'),
          mensagem: 'As cores estão muito frias. Precisa de tons mais quentes para combinar com a campanha de verão.',
        }
      },
      {
        id: '2', nome: 'Institucional TechCorp',
        descricao: 'Vídeo institucional de 2 minutos para website',
        cliente: 'TechCorp', editor: 'Carlos Lima',
        status: 'em_revisao', progresso: 90, prazo: new Date('2026-03-14'),
        feedback: {
          autor: 'Cliente TechCorp', versao: 'v2', data: new Date('2026-03-07'), rejeicoes: 2,
          mensagem: 'Melhorou, mas a trilha não combina com o tom da empresa. Trocar para algo mais corporativo.',
        }
      },
      {
        id: '3', nome: 'Tutorial App Mobile',
        descricao: 'Série de 5 tutoriais para onboarding do app',
        cliente: 'StartupXYZ', editor: 'Maria Santos',
        status: 'em_andamento', progresso: 30, prazo: new Date('2026-03-31'),
      },
      {
        id: '4', nome: 'Evento Corporativo',
        descricao: 'Cobertura em vídeo do evento anual da empresa',
        cliente: 'Loja Fashion', editor: 'Ana Silva',
        status: 'aprovado', progresso: 100, prazo: new Date('2026-02-20'),
      },
      {
        id: '5', nome: 'Reel Instagram',
        descricao: 'Sequência de reels curtos para redes sociais',
        cliente: 'Loja Fashion', editor: 'Carlos Lima',
        status: 'pausado', progresso: 15, prazo: new Date('2026-03-24'),
      },
      {
        id: '6', nome: 'Vídeo Aniversário',
        descricao: 'Vídeo comemorativo de 10 anos da marca',
        cliente: 'Marca Sol', editor: 'Maria Santos',
        status: 'rascunho', progresso: 5, prazo: new Date('2026-04-10'),
      },
    ];
  }
}
