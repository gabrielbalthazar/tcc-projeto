import type { ProjetoStatus } from './dashboard.model';

export interface ProjetoFeedback {
  autor: string;
  versao: string;
  data: Date;
  mensagem: string;
  rejeicoes?: number;
}

export interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  cliente: string;
  editor: string;
  status: ProjetoStatus;
  progresso: number;
  prazo: Date;
  feedback?: ProjetoFeedback;
}

export interface CreateProjetoPayload {
  nome: string;
  cliente: string;
  editor: string;
  prazo: string;
  descricao: string;
}

export type { ProjetoStatus };
