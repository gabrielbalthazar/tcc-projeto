export interface Cliente {
  id: string;
  usuarioId: string;
  nome: string;
  empresa: string | null;
  email: string;
  telefone: string | null;
  observacoes: string | null;
  projetosAtivos: number;
  cadastroPendente: boolean;
  emailEditavel: boolean;
}

export interface ClientePayload {
  nome: string;
  empresa?: string;
  email: string;
  telefone?: string;
  observacoes?: string;
}
