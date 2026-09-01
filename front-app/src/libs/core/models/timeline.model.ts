export type TimelineStatus =
  | 'aprovada'
  | 'rejeitada'
  | 'aguardando_revisao'
  | 'aguardando_download';

export type TimelineEventoTipo = 'versao' | 'entrega';

export interface TimelineArquivo {
  nome: string;
  enviadoPor?: string;
}

export interface TimelineComentario {
  mensagem: string;
  autor: string;
}

export interface TimelineEvento {
  id: string;
  tipo: TimelineEventoTipo;
  titulo: string;
  status: TimelineStatus;
  data: Date;
  arquivo?: TimelineArquivo;
  comentario?: TimelineComentario;
}

export interface TimelineProjeto {
  id: string;
  projeto: string;
  cliente: string;
  status: TimelineStatus;
  eventos: TimelineEvento[];
}
