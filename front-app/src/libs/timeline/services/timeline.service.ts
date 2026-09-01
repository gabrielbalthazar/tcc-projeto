import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TimelineProjeto } from '../../core/models/timeline.model';

@Injectable({ providedIn: 'root' })
export class TimelineService {

  private readonly API = 'http://localhost:8080/api/timeline';
  private timeline: TimelineProjeto[] = this.getMockData();

  constructor(
    private http: HttpClient,
  ) { }

  getTimeline(): Observable<TimelineProjeto[]> {
    //return this.http.get<TimelineProjeto[]>(this.API);
    return of(this.timeline);
  }

  private getMockData(): TimelineProjeto[] {
    return [
      {
        id: '1',
        projeto: 'Campanha Verão 2026',
        cliente: 'Marca Sol',
        status: 'rejeitada',
        eventos: [
          {
            id: '1-1',
            tipo: 'versao',
            titulo: 'Versão 1',
            status: 'rejeitada',
            data: new Date('2026-03-05'),
            comentario: {
              mensagem: 'As cores estão muito frias. Precisa de tons mais quentes para combinar com a campanha de verão.',
              autor: 'Marca Sol - Marketing',
            },
          },
        ],
      },
      {
        id: '2',
        projeto: 'Institucional TechCorp',
        cliente: 'TechCorp',
        status: 'aguardando_revisao',
        eventos: [
          {
            id: '2-1',
            tipo: 'versao',
            titulo: 'Versão 1',
            status: 'rejeitada',
            data: new Date('2026-03-04'),
            comentario: {
              mensagem: 'Precisa ajustar a introdução, está muito longa. Reduzir para 10 segundos.',
              autor: 'Cliente TechCorp',
            },
          },
          {
            id: '2-2',
            tipo: 'versao',
            titulo: 'Versão 2',
            status: 'rejeitada',
            data: new Date('2026-03-07'),
            comentario: {
              mensagem: 'Melhorou, mas a trilha não combina com o tom da empresa. Trocar para algo mais corporativo.',
              autor: 'Cliente TechCorp',
            },
          },
          {
            id: '2-3',
            tipo: 'versao',
            titulo: 'Versão 3',
            status: 'aguardando_revisao',
            data: new Date('2026-03-09'),
            arquivo: { nome: 'video_institucional_v3.mp4' },
          },
          {
            id: '2-4',
            tipo: 'entrega',
            titulo: 'Entrega enviada',
            status: 'aguardando_download',
            data: new Date('2026-03-09'),
            arquivo: {
              nome: 'institucional_techcorp_v3.mp4',
              enviadoPor: 'Carlos Lima',
            },
          },
        ],
      },
      {
        id: '3',
        projeto: 'Evento Corporativo',
        cliente: 'Loja Fashion',
        status: 'aprovada',
        eventos: [
          {
            id: '3-1',
            tipo: 'versao',
            titulo: 'Versão 1',
            status: 'aprovada',
            data: new Date('2026-02-16'),
            comentario: {
              mensagem: 'Ficou excelente! Pode seguir com a entrega final.',
              autor: 'Loja Fashion - Eventos',
            },
          },
          {
            id: '3-2',
            tipo: 'entrega',
            titulo: 'Entrega enviada',
            status: 'aprovada',
            data: new Date('2026-02-18'),
            arquivo: {
              nome: 'evento_corporativo_final.mp4',
              enviadoPor: 'Ana Silva',
            },
          },
        ],
      },
    ];
  }
}
