import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DashboardData, ProjetoProgresso, PrazoProximo } from '../../core/models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private readonly API = 'http://localhost:8080/api/dashboard';

  constructor(
    private http: HttpClient,
  ) { }

  getData(): Observable<DashboardData> {
    //return this.http.get<DashboardData>(this.API);
    return of(this.getMockData());
  }

  getProjetos(): Observable<ProjetoProgresso[]> {
    //return this.http.get<ProjetoProgresso[]>(`${this.API}/projetos`);
    return of(this.getMockData().projetos);
  }

  getPrazos(): Observable<PrazoProximo[]> {
    //return this.http.get<PrazoProximo[]>(`${this.API}/prazos`);
    return of(this.getMockData().prazos);
  }

  private getMockData(): DashboardData {
    return {
      stats: [
        { icon: 'folder_open', value: 2, label: 'Projetos Ativos', color: '#7c3aed' },
        { icon: 'format_list_bulleted', value: 6, label: 'Tarefas Pendentes', color: '#f59e0b' },
        { icon: 'schedule', value: 1, label: 'Em Revisão', color: '#06b6d4' },
        { icon: 'check_circle', value: 1, label: 'Concluídos', color: '#10b981' },
      ],
      projetos: [
        {
          id: '1', nome: 'Campanha Verão 2026',
          cliente: 'Marca Sol', status: 'em_andamento',
          progresso: 65, prazo: new Date('2026-03-19')
        },
        {
          id: '2', nome: 'Institucional TechCorp',
          cliente: 'TechCorp', status: 'em_revisao',
          progresso: 90, prazo: new Date('2026-03-14')
        },
        {
          id: '3', nome: 'Tutorial App Mobile',
          cliente: 'StartupXYZ', status: 'em_andamento',
          progresso: 30, prazo: new Date('2026-03-31')
        },
        {
          id: '4', nome: 'Reel Instagram',
          cliente: 'Loja Fashion', status: 'pausado',
          progresso: 15, prazo: new Date('2026-03-24')
        },
      ],
      prazos: [
        { id: '1', nome: 'Campanha Verão 2026', cliente: 'Marca Sol', prazo: new Date('2026-03-19'), diasRestantes: -10 },
        { id: '2', nome: 'Institucional TechCorp', cliente: 'TechCorp', prazo: new Date('2026-03-14'), diasRestantes: -15 },
        { id: '3', nome: 'Tutorial App Mobile', cliente: 'StartupXYZ', prazo: new Date('2026-03-31'), diasRestantes: 1 },
        { id: '4', nome: 'Reel Instagram', cliente: 'Loja Fashion', prazo: new Date('2026-03-24'), diasRestantes: -6 },
      ]
    };
  }
}
