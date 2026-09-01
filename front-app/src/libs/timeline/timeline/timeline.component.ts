import { Component, OnInit } from '@angular/core';
import { TimelineEvento, TimelineProjeto, TimelineStatus } from '../../core/models/timeline.model';
import { TimelineService } from '../services/timeline.service';
import { LoadingService } from '../../shared/components/services/loading.service';

interface StatusMeta {
  label: string;
  color: string;
  bg: string;
  icon: string;
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  standalone: false,
})
export class TimelineComponent implements OnInit {
  timeline: TimelineProjeto[] = [];

  projetoSelecionado = 'todos';
  projetos: string[] = [];

  private colapsados = new Set<string>();

  private readonly statusMeta: Record<TimelineStatus, StatusMeta> = {
    aprovada: {
      label: 'Aprovada pelo cliente',
      color: '#059669', bg: '#ecfdf5', icon: 'check_circle',
    },
    rejeitada: {
      label: 'Rejeitada pelo cliente',
      color: '#dc2626', bg: '#fef2f2', icon: 'cancel',
    },
    aguardando_revisao: {
      label: 'Aguardando revisão',
      color: '#d97706', bg: '#fffbeb', icon: 'schedule',
    },
    aguardando_download: {
      label: 'Aguardando download',
      color: '#d97706', bg: '#fffbeb', icon: 'schedule',
    },
  };

  constructor(
    private timelineService: TimelineService,
    private loadingService: LoadingService,
  ) { }

  ngOnInit(): void {
    this.carregarTimeline();
  }

  carregarTimeline(): void {
    this.loadingService.show('Carregando timeline...');
    this.timelineService.getTimeline().subscribe({
      next: (timeline) => {
        this.timeline = timeline;
        this.projetos = Array.from(new Set(timeline.map(t => t.projeto)));
        this.loadingService.hide();
      },
      error: () => {
        this.loadingService.hide();
      },
    });
  }

  get projetosVisiveis(): TimelineProjeto[] {
    if (this.projetoSelecionado === 'todos') {
      return this.timeline;
    }
    return this.timeline.filter(t => t.projeto === this.projetoSelecionado);
  }

  onProjetoChange(event: Event): void {
    this.projetoSelecionado = (event.target as HTMLSelectElement).value;
  }

  toggleColapso(id: string): void {
    if (this.colapsados.has(id)) {
      this.colapsados.delete(id);
    } else {
      this.colapsados.add(id);
    }
  }

  isColapsado(id: string): boolean {
    return this.colapsados.has(id);
  }

  contarAtualizacoes(projeto: TimelineProjeto): number {
    return projeto.eventos.length;
  }

  metaDe(status: TimelineStatus): StatusMeta {
    return this.statusMeta[status];
  }

  corDoMarcador(evento: TimelineEvento): string {
    if (evento.tipo === 'entrega') {
      return '#7c3aed';
    }
    return this.statusMeta[evento.status].color;
  }

  iconeDoMarcador(evento: TimelineEvento): string {
    if (evento.tipo === 'entrega') {
      return 'near_me';
    }
    return this.statusMeta[evento.status].icon;
  }

  trackByProjeto(_index: number, projeto: TimelineProjeto): string {
    return projeto.id;
  }

  trackByEvento(_index: number, evento: TimelineEvento): string {
    return evento.id;
  }
}
