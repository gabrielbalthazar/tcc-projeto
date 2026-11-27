import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TimelineEvento, TimelineProjeto, TimelineStatus } from '../../core/models/timeline.model';
import { TimelineService } from '../services/timeline.service';
import { LoadingService } from '../../shared/components/services/loading.service';
import { NotificationService } from '../../core/services/notification.service';
import { finalize, timeout } from 'rxjs';

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
  projetos: { id: string; nome: string }[] = [];
  arquivo: File | null = null;
  mensagem = '';
  enviando = false;

  private colapsados = new Set<string>();

  private readonly statusMeta: Record<TimelineStatus, StatusMeta> = {
    sem_versao: {
      label: 'Nenhum vídeo enviado',
      color: '#6b7280', bg: '#f3f4f6', icon: 'movie',
    },
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
    private notifications: NotificationService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.carregarTimeline();
  }

  carregarTimeline(): void {
    this.loadingService.show('Carregando timeline...');
    this.timelineService.getTimeline().pipe(
      timeout({ first: 15000 }),
      finalize(() => this.loadingService.hide()),
    ).subscribe({
      next: (timeline) => {
        this.timeline = timeline;
        this.projetos = timeline.map(t => ({ id: t.id, nome: t.projeto }));
        this.cdr.markForCheck();
      },
      error: () => undefined,
    });
  }

  get projetosVisiveis(): TimelineProjeto[] {
    if (this.projetoSelecionado === 'todos') {
      return this.timeline;
    }
    return this.timeline.filter(t => t.id === this.projetoSelecionado);
  }

  onProjetoChange(event: Event): void {
    this.projetoSelecionado = (event.target as HTMLSelectElement).value;
  }

  selecionarArquivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0] ?? null;
    if (arquivo && arquivo.size > 100 * 1024 * 1024) {
      this.notifications.showError('O vídeo excede o limite de 100 MB.');
      input.value = '';
      this.arquivo = null;
      return;
    }
    this.arquivo = arquivo;
  }

  enviarVersao(campo: HTMLInputElement): void {
    if (!this.arquivo || this.projetoSelecionado === 'todos') return;
    this.enviando = true;
    this.loadingService.show('Enviando vídeo...');
    this.timelineService.enviarVersao(this.projetoSelecionado, this.arquivo, this.mensagem).pipe(
      finalize(() => { this.enviando = false; this.loadingService.hide(); }),
    ).subscribe({
      next: () => {
        this.arquivo = null;
        this.mensagem = '';
        campo.value = '';
        this.carregarTimeline();
      },
      error: () => undefined,
    });
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
