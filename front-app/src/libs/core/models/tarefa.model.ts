export type TarefaStatus = 'pendente' | 'em_progresso' | 'revisao' | 'concluido';

export type TarefaPrioridade = 'baixa' | 'media' | 'alta';

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: TarefaPrioridade;
  responsavelId: string;
  responsavel: string;
  projetoId: string;
  projeto: string;
  status: TarefaStatus;
}

/** O responsável é sempre o editor logado (definido pelo back-end). */
export interface CreateTarefaPayload {
  titulo: string;
  descricao: string;
  prioridade: TarefaPrioridade;
  projetoId: string;
  status: TarefaStatus;
}
