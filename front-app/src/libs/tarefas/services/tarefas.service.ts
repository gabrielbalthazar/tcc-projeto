import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CreateTarefaPayload, Tarefa, TarefaStatus } from '../../core/models/tarefa.model';

@Injectable({ providedIn: 'root' })
export class TarefasService {

  private readonly API = 'http://localhost:8080/api/tarefas';
  private tarefas: Tarefa[] = this.getMockData();

  constructor(
    private http: HttpClient,
  ) { }

  getTarefas(): Observable<Tarefa[]> {
    //return this.http.get<Tarefa[]>(this.API);
    return of(this.tarefas);
  }

  createTarefa(payload: CreateTarefaPayload): Observable<Tarefa> {
    //return this.http.post<Tarefa>(this.API, payload);
    const nova: Tarefa = {
      id: String(this.tarefas.length + 1),
      titulo: payload.titulo,
      descricao: payload.descricao,
      prioridade: payload.prioridade,
      responsavel: payload.responsavel,
      projeto: payload.projeto,
      status: payload.status,
    };
    this.tarefas = [...this.tarefas, nova];
    return of(nova);
  }

  atualizarStatus(id: string, status: TarefaStatus): Observable<Tarefa | undefined> {
    //return this.http.patch<Tarefa>(`${this.API}/${id}`, { status });
    const tarefa = this.tarefas.find(t => t.id === id);
    if (tarefa) {
      tarefa.status = status;
    }
    return of(tarefa);
  }

  private getMockData(): Tarefa[] {
    return [
      {
        id: '1', titulo: 'Motion graphics',
        descricao: 'Animações de texto e transições',
        prioridade: 'media', responsavel: 'Carlos Lima',
        projeto: 'Campanha Verão 2026', status: 'pendente',
      },
      {
        id: '2', titulo: 'Mixagem de áudio',
        descricao: 'Ajuste de trilha e sound design',
        prioridade: 'media', responsavel: 'Maria Santos',
        projeto: 'Campanha Verão 2026', status: 'pendente',
      },
      {
        id: '3', titulo: 'Color grading',
        descricao: 'Aplicar LUT e correção de cor',
        prioridade: 'alta', responsavel: 'Ana Silva',
        projeto: 'Campanha Verão 2026', status: 'em_progresso',
      },
      {
        id: '4', titulo: 'Legendas',
        descricao: 'Adicionar legendas em PT e EN',
        prioridade: 'baixa', responsavel: 'Maria Santos',
        projeto: 'Institucional TechCorp', status: 'em_progresso',
      },
      {
        id: '5', titulo: 'Gravação tela',
        descricao: 'Screen recording do app',
        prioridade: 'alta', responsavel: 'Maria Santos',
        projeto: 'Tutorial App Mobile', status: 'em_progresso',
      },
      {
        id: '6', titulo: 'Montagem final',
        descricao: 'Versão final do institucional',
        prioridade: 'alta', responsavel: 'Carlos Lima',
        projeto: 'Institucional TechCorp', status: 'revisao',
      },
      {
        id: '7', titulo: 'Cortar takes brutos',
        descricao: 'Selecionar e cortar melhores takes',
        prioridade: 'alta', responsavel: 'Ana Silva',
        projeto: 'Campanha Verão 2026', status: 'concluido',
      },
      {
        id: '8', titulo: 'Roteiro tutorial 1',
        descricao: 'Escrever roteiro do primeiro tutorial',
        prioridade: 'media', responsavel: 'Maria Santos',
        projeto: 'Tutorial App Mobile', status: 'concluido',
      },
    ];
  }
}
