import type { ProjetoStatus } from './dashboard.model';

export interface ProjetoFeedback {
  autor: string;
  versao: string;
  data: string;
  mensagem: string;
  rejeicoes?: number;
}

export interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  clienteId: string;
  cliente: string;
  editorId: string;
  editor: string;
  status: ProjetoStatus;
  progresso: number;
  prazo: string;
  feedback?: ProjetoFeedback;
}

/** O editor responsável é sempre o editor logado (definido pelo back-end). */
export interface CreateProjetoPayload {
  nome: string;
  /** Id da conta do cliente (Cliente.usuarioId). */
  clienteId: string;
  prazo: string;
  descricao: string;
}

export interface UpdateProjetoPayload extends CreateProjetoPayload {
  status: ProjetoStatus;
  progresso: number;
}

export type { ProjetoStatus };
