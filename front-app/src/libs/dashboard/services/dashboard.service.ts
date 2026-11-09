import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../core/api.config';
import { DashboardData, ProjetoProgresso, PrazoProximo } from '../../core/models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private readonly API = `${API_URL}/dashboard`;

  constructor(
    private http: HttpClient,
  ) { }

  getData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.API);
  }

  getProjetos(): Observable<ProjetoProgresso[]> {
    return this.http.get<ProjetoProgresso[]>(`${this.API}/projetos`);
  }

  getPrazos(): Observable<PrazoProximo[]> {
    return this.http.get<PrazoProximo[]>(`${this.API}/prazos`);
  }
}
