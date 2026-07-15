import { Component, Input } from '@angular/core';
import { ProjetoProgresso, ProjetoStatus } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-project-progress-item',
  standalone: false,
  templateUrl: './project-progress-item.component.html',
  styleUrls: ['./project-progress-item.component.scss'],
})
export class ProjectProgressItemComponent {
  @Input() projeto!: ProjetoProgresso;

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
      em_andamento: 'badge badge-andamento',
      em_revisao: 'badge badge-revisao',
      pausado: 'badge badge-pausado',
      aprovado: 'badge badge-aprovado',
      rascunho: 'badge badge-pausado',
      cancelado: 'badge badge-pausado',
    };
    return classes[this.projeto.status];
  }
}
