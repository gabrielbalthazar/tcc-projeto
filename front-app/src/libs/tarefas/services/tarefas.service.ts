import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../core/api.config';
import { CreateTarefaPayload, Tarefa, TarefaStatus } from '../../core/models/tarefa.model';

@Injectable({ providedIn: 'root' })
export class TarefasService {

  private readonly API = `${API_URL}/tarefas`;

  constructor(
    private http: HttpClient,
  ) { }

  getTarefas(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.API);
  }

  getTarefa(id: string): Observable<Tarefa> {
    return this.http.get<Tarefa>(`${this.API}/${id}`);
  }

  createTarefa(payload: CreateTarefaPayload): Observable<Tarefa> {
    return this.http.post<Tarefa>(this.API, payload);
  }

  updateTarefa(id: string, payload: CreateTarefaPayload): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${this.API}/${id}`, payload);
  }

  atualizarStatus(id: string, status: TarefaStatus): Observable<Tarefa> {
    return this.http.patch<Tarefa>(`${this.API}/${id}`, { status });
  }

  deleteTarefa(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
