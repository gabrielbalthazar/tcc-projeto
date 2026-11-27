export type AprovacaoDecisao = 'aprovar' | 'ajustes';

export type MaterialStatus = 'pendente' | 'aprovado' | 'ajustes_solicitados';

export type RevisaoStatus = 'pendente' | 'rejeitada' | 'aprovada';

export interface MaterialArquivo {
  nome: string;
  url?: string;
}

export interface MaterialCliente {
  nome: string;
  email: string;
}

export interface VersaoHistorico {
  id: string;
  numero: number;
  status: RevisaoStatus;
  mensagemEditor: string;
  comentarioCliente: string;
  enviadaEm: Date;
  avaliadaEm?: Date;
  arquivo: MaterialArquivo;
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
  comentarioCliente: string;
  arquivo: MaterialArquivo;
  historico: VersaoHistorico[];
}

export interface AvaliacaoPayload {
  materialId: string;
  decisao: AprovacaoDecisao;
  comentario?: string;
}

export interface Versao {
  id: string;
  projetoId: string;
  numero: number;
  nomeArquivo: string;
  arquivoUrl: string;
  tipoArquivo?: string;
  tamanhoArquivo: number;
  mensagemEditor?: string;
  status: 'aguardando_revisao' | 'ajustes_solicitados' | 'aprovada';
  comentarioCliente?: string;
  enviadoPor: string;
  criadaEm: string;
  avaliadaEm?: string;
}
