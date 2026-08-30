export type TarefaStatus = 'pendente' | 'em_progresso' | 'revisao' | 'concluido';

export type TarefaPrioridade = 'baixa' | 'media' | 'alta';

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: TarefaPrioridade;
  responsavel: string;
  projeto: string;
  status: TarefaStatus;
}

export interface CreateTarefaPayload {
  titulo: string;
  descricao: string;
  prioridade: TarefaPrioridade;
  responsavel: string;
  projeto: string;
  status: TarefaStatus;
}
