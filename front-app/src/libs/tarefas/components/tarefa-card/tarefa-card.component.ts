import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tarefa, TarefaPrioridade, TarefaStatus } from '../../../core/models/tarefa.model';

export interface MudancaStatus {
  id: string;
  status: TarefaStatus;
}

@Component({
  selector: 'app-tarefa-card',
  standalone: false,
  templateUrl: './tarefa-card.component.html',
  styleUrls: ['./tarefa-card.component.scss'],
})
export class TarefaCardComponent {
  @Input() tarefa!: Tarefa;
  @Output() mudarStatus = new EventEmitter<MudancaStatus>();

  readonly statusOptions: { label: string; value: TarefaStatus }[] = [
    { label: 'Pendente', value: 'pendente' },
    { label: 'Em Progresso', value: 'em_progresso' },
    { label: 'Revisão', value: 'revisao' },
    { label: 'Concluído', value: 'concluido' },
  ];

  get prioridadeLabel(): string {
    const labels: Record<TarefaPrioridade, string> = {
      baixa: 'Baixa',
      media: 'Média',
      alta: 'Alta',
    };
    return labels[this.tarefa.prioridade];
  }

  get prioridadeClass(): string {
    const classes: Record<TarefaPrioridade, string> = {
      baixa: 'badge-baixa',
      media: 'badge-media',
      alta: 'badge-alta',
    };
    return classes[this.tarefa.prioridade];
  }

  onStatusChange(event: Event): void {
    const status = (event.target as HTMLSelectElement).value as TarefaStatus;
    if (status !== this.tarefa.status) {
      this.mudarStatus.emit({ id: this.tarefa.id, status });
    }
  }
}
