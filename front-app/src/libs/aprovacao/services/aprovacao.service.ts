import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  AvaliacaoPayload,
  MaterialAprovacao,
} from '../../core/models/aprovacao.model';

@Injectable({ providedIn: 'root' })
export class AprovacaoService {

  private readonly API = 'http://localhost:8080/api/aprovacao';
  private readonly material$ = new BehaviorSubject<MaterialAprovacao>(this.getMockData());

  constructor(
    private http: HttpClient,
  ) { }

  getMaterial(): Observable<MaterialAprovacao> {
    //return this.http.get<MaterialAprovacao>(`${this.API}/atual`);
    return this.material$.asObservable();
  }

  enviarAvaliacao(payload: AvaliacaoPayload): Observable<MaterialAprovacao> {
    //return this.http.post<MaterialAprovacao>(`${this.API}/avaliar`, payload);
    const atual = this.material$.value;
    const aprovado = payload.decisao === 'aprovar';
    const comentario = payload.comentario?.trim()
      || (aprovado ? 'Aprovado sem comentários adicionais.' : 'Ajustes solicitados sem comentários adicionais.');

    const atualizado: MaterialAprovacao = {
      ...atual,
      status: aprovado ? 'aprovado' : 'ajustes_solicitados',
      historico: [
        ...atual.historico,
        {
          versao: atual.versaoAtual,
          status: aprovado ? 'aprovada' : 'rejeitada',
          comentario,
        },
      ],
    };

    this.material$.next(atualizado);
    return of(atualizado);
  }

  private getMockData(): MaterialAprovacao {
    return {
      id: '1',
      projeto: 'Institucional TechCorp',
      empresa: 'TechCorp',
      cliente: {
        nome: 'João Mendes',
        email: 'joao@techcorp.com.br',
      },
      editor: 'Carlos Lima',
      versaoAtual: 3,
      data: new Date('2026-03-09'),
      status: 'pendente',
      mensagemEditor:
        'Olá! Segue a versão 3 do vídeo institucional com as correções solicitadas. '
        + 'A trilha foi substituída por uma mais corporativa e a introdução reduzida para 10 segundos.',
      arquivo: {
        nome: 'institucional_techcorp_v3.mp4',
      },
      historico: [
        {
          versao: 1,
          status: 'rejeitada',
          comentario: 'Precisa ajustar a introdução, está muito longa. Reduzir para 10 segundos.',
        },
        {
          versao: 2,
          status: 'rejeitada',
          comentario: 'Melhorou, mas a trilha não combina com o tom da empresa. Trocar para algo mais corporativo.',
        },
      ],
    };
  }
}
