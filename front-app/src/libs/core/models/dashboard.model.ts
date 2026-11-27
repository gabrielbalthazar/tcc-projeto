export type ProjetoStatus =
  'em_andamento' | 'em_revisao' | 'pausado' | 'aprovado' | 'rascunho' | 'cancelado' | 'ajustes_solicitados';

export const STATUS_MANUAIS: ProjetoStatus[] = ['rascunho', 'em_andamento', 'pausado', 'cancelado'];

export const STATUS_COM_ENVIO: ProjetoStatus[] = ['rascunho', 'em_andamento', 'ajustes_solicitados'];

export interface StatCard {
  icon: string;
  value: number;
  label: string;
  color: string;
}

export interface ProjetoProgresso {
  id: string;
  nome: string;
  cliente: string;
  status: ProjetoStatus;
  progresso: number;
  prazo: string;
}

export interface PrazoProximo {
  id: string;
  nome: string;
  cliente: string;
  prazo: string;
  diasRestantes: number;
}

export interface DashboardData {
  stats: StatCard[];
  projetos: ProjetoProgresso[];
  prazos: PrazoProximo[];
}
