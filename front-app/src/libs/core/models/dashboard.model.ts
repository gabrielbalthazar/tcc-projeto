export type ProjetoStatus =
  'em_andamento' | 'em_revisao' | 'pausado' | 'aprovado' | 'rascunho' | 'cancelado';

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
  prazo: Date;
}

export interface PrazoProximo {
  id: string;
  nome: string;
  cliente: string;
  prazo: Date;
  diasRestantes: number;
}

export interface DashboardData {
  stats: StatCard[];
  projetos: ProjetoProgresso[];
  prazos: PrazoProximo[];
}
