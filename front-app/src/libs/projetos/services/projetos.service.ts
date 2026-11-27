import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../core/api.config';
import { CreateProjetoPayload, Projeto, UpdateProjetoPayload } from '../../core/models/projeto.model';
import { Versao } from '../../core/models/aprovacao.model';

@Injectable({ providedIn: 'root' })
export class ProjetosService {

  private readonly API = `${API_URL}/projetos`;

  constructor(
    private http: HttpClient,
  ) { }

  getProjetos(): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(this.API);
  }

  getProjeto(id: string): Observable<Projeto> {
    return this.http.get<Projeto>(`${this.API}/${id}`);
  }

  createProjeto(payload: CreateProjetoPayload): Observable<Projeto> {
    return this.http.post<Projeto>(this.API, payload);
  }

  updateProjeto(id: string, payload: UpdateProjetoPayload): Observable<Projeto> {
    return this.http.put<Projeto>(`${this.API}/${id}`, payload);
  }

  deleteProjeto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  getVersoes(projetoId: string): Observable<Versao[]> {
    return this.http.get<Versao[]>(`${this.API}/${projetoId}/versoes`);
  }

  enviarVersao(projetoId: string, arquivo: File, mensagem: string): Observable<HttpEvent<Versao>> {
    const form = new FormData();
    form.append('arquivo', arquivo);
    form.append('mensagem', mensagem);
    return this.http.post<Versao>(`${this.API}/${projetoId}/versoes`, form, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
