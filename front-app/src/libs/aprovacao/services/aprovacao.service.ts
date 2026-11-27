import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { API_URL } from '../../core/api.config';
import {
  AvaliacaoPayload,
  MaterialAprovacao,
  Versao,
} from '../../core/models/aprovacao.model';
import { ProjetosService } from '../../projetos/services/projetos.service';
import { Projeto } from '../../core/models/projeto.model';

@Injectable({ providedIn: 'root' })
export class AprovacaoService {

  private readonly API = `${API_URL}`;

  constructor(
    private http: HttpClient,
    private projetosService: ProjetosService,
  ) { }

  getMaterial(projetoId: string): Observable<MaterialAprovacao> {
    return this.projetosService.getProjeto(projetoId).pipe(
      switchMap(projeto => this.http.get<Versao[]>(`${this.API}/projetos/${projetoId}/versoes`).pipe(
        map(versoes => this.toMaterial(projeto, versoes)),
      )),
    );
  }

  enviarAvaliacao(payload: AvaliacaoPayload): Observable<MaterialAprovacao> {
    return this.http.post<Versao>(`${this.API}/versoes/${payload.materialId}/avaliar`, {
      decisao: payload.decisao,
      comentario: payload.comentario?.trim(),
    }).pipe(switchMap(versao => this.getMaterial(versao.projetoId)));
  }

  private toMaterial(projeto: Projeto, versoes: Versao[]): MaterialAprovacao {
    const atual = versoes[0];
    return {
      id: atual?.id ?? projeto.id,
      projeto: projeto.nome,
      empresa: projeto.cliente,
      cliente: { nome: projeto.cliente, email: '' },
      editor: projeto.editor,
      versaoAtual: atual?.numero ?? 0,
      data: new Date(atual?.criadaEm ?? projeto.prazo),
      status: atual?.status === 'aprovada' ? 'aprovado'
        : atual?.status === 'ajustes_solicitados' ? 'ajustes_solicitados' : 'pendente',
      mensagemEditor: atual?.mensagemEditor ?? '',
      comentarioCliente: atual?.comentarioCliente ?? '',
      arquivo: { nome: atual?.nomeArquivo ?? '', url: atual?.arquivoUrl },
      historico: versoes.slice(1).filter(v => !!v.avaliadaEm).map(v => ({
        versao: v.numero,
        status: v.status === 'aprovada' ? 'aprovada' : 'rejeitada',
        comentario: v.comentarioCliente ?? '',
      })),
    };
  }
}
