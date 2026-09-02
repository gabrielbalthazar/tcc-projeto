export type AprovacaoDecisao = 'aprovar' | 'ajustes';

export type MaterialStatus = 'pendente' | 'aprovado' | 'ajustes_solicitados';

export type RevisaoStatus = 'rejeitada' | 'aprovada';

export interface RevisaoHistorico {
  versao: number;
  status: RevisaoStatus;
  comentario: string;
}

export interface MaterialArquivo {
  nome: string;
  url?: string;
}

export interface MaterialCliente {
  nome: string;
  email: string;
}

export interface MaterialAprovacao {
  id: string;
  projeto: string;
  empresa: string;
  cliente: MaterialCliente;
  editor: string;
  versaoAtual: number;
  data: Date;
  status: MaterialStatus;
  mensagemEditor: string;
  arquivo: MaterialArquivo;
  historico: RevisaoHistorico[];
}

export interface AvaliacaoPayload {
  materialId: string;
  decisao: AprovacaoDecisao;
  comentario?: string;
}
