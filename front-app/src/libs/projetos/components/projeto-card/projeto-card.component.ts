import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Projeto } from '../../../core/models/projeto.model';
import { ProjetoStatus } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-projeto-card',
  standalone: false,
  templateUrl: './projeto-card.component.html',
  styleUrls: ['./projeto-card.component.scss'],
})
export class ProjetoCardComponent {
  @Input() projeto!: Projeto;
  @Output() enviarAoCliente = new EventEmitter<string>();

  get statusLabel(): string {
    const labels: Record<ProjetoStatus, string> = {
      em_andamento: 'Em andamento',
      em_revisao: 'Em revisão',
      pausado: 'Pausado',
      aprovado: 'Aprovado',
      rascunho: 'Rascunho',
      cancelado: 'Cancelado',
    };
    return labels[this.projeto.status];
  }

  get statusClass(): string {
    const classes: Record<ProjetoStatus, string> = {
      em_andamento: 'badge-andamento',
      em_revisao: 'badge-revisao',
      pausado: 'badge-pausado',
      aprovado: 'badge-aprovado',
      rascunho: 'badge-pausado',
      cancelado: 'badge-pausado',
    };
    return classes[this.projeto.status];
  }
}
