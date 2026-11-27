import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { CreateTarefaPayload, Tarefa, TarefaStatus } from '../../core/models/tarefa.model';
import { TarefasService } from '../services/tarefas.service';
import { LoadingService } from '../../shared/components/services/loading.service';
import { NovaTarefaModalComponent } from '../components/nova-tarefa-modal/nova-tarefa-modal.component';
import { MudancaStatus } from '../components/tarefa-card/tarefa-card.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog.component';

interface Coluna {
  status: TarefaStatus;
  label: string;
  accent: string;
  tarefas: Tarefa[];
}

@Component({
  selector: 'app-tarefas',
  templateUrl: './tarefas.component.html',
  styleUrls: ['./tarefas.component.scss'],
  standalone: false,
})
export class TarefasComponent implements OnInit {
  tarefas: Tarefa[] = [];

  projetoSelecionado = 'todos';
  projetos: string[] = [];

  readonly colunas: Coluna[] = [
    { status: 'pendente', label: 'Pendente', accent: '#9ca3af', tarefas: [] },
    { status: 'em_progresso', label: 'Em Progresso', accent: '#7c3aed', tarefas: [] },
    { status: 'revisao', label: 'Revisão', accent: '#f59e0b', tarefas: [] },
    { status: 'concluido', label: 'Concluído', accent: '#10b981', tarefas: [] },
  ];

  readonly dropListIds = this.colunas.map(c => `coluna-${c.status}`);

  constructor(
    private cdr: ChangeDetectorRef,
    private tarefasService: TarefasService,
    private loadingService: LoadingService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.carregarTarefas();
  }

  carregarTarefas(): void {
    this.loadingService.show('Carregando tarefas...');
    this.tarefasService.getTarefas().subscribe({
      next: (tarefas) => {
        this.tarefas = tarefas;
        this.projetos = Array.from(new Set(tarefas.map(t => t.projeto)));
        if (!this.projetos.includes(this.projetoSelecionado)) {
          this.projetoSelecionado = 'todos';
        }
        this.distribuirColunas();
        this.loadingService.hide();
      },
      error: () => {
        this.loadingService.hide();
      }
    });
  }

  distribuirColunas(): void {
    const visiveis = this.projetoSelecionado === 'todos'
      ? this.tarefas
      : this.tarefas.filter(t => t.projeto === this.projetoSelecionado);

    for (const coluna of this.colunas) {
      coluna.tarefas = visiveis.filter(t => t.status === coluna.status);
    }
  }

  onProjetoChange(event: Event): void {
    this.projetoSelecionado = (event.target as HTMLSelectElement).value;
    this.distribuirColunas();
  }

  drop(event: CdkDragDrop<Tarefa[]>, novoStatus: TarefaStatus): void {
    if (event.previousContainer === event.container) {
      return;
    }

    const tarefa = event.previousContainer.data[event.previousIndex];
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );

    this.persistirStatus(tarefa.id, novoStatus);
  }

  onMudarStatus(mudanca: MudancaStatus): void {
    this.persistirStatus(mudanca.id, mudanca.status);
  }

  private persistirStatus(id: string, status: TarefaStatus): void {
    const tarefa = this.tarefas.find(t => t.id === id);
    if (tarefa) {
      tarefa.status = status;
    }

    this.tarefasService.atualizarStatus(id, status).subscribe({
      next: () => {
        this.distribuirColunas();
        this.cdr.markForCheck();
      },
      error: () => this.carregarTarefas(),
    });
  }

  abrirNovaTarefa(): void {
    const dialogRef = this.dialog.open(NovaTarefaModalComponent, {
      width: '420px',
      autoFocus: false,
      panelClass: 'app-dialog-panel',
    });

    dialogRef.afterClosed().subscribe((payload: CreateTarefaPayload | undefined) => {
      if (!payload) return;

      this.loadingService.show('Criando tarefa...');
      this.tarefasService.createTarefa(payload).subscribe({
        next: () => {
          this.carregarTarefas();
        },
        error: () => {
          this.loadingService.hide();
        }
      });
    });
  }

  editarTarefa(tarefa: Tarefa): void {
    const dialogRef = this.dialog.open(NovaTarefaModalComponent, {
      width: '420px',
      autoFocus: false,
      panelClass: 'app-dialog-panel',
      data: tarefa,
    });

    dialogRef.afterClosed().subscribe((payload: CreateTarefaPayload | undefined) => {
      if (!payload) return;

      this.loadingService.show('Salvando tarefa...');
      this.tarefasService.updateTarefa(tarefa.id, payload).subscribe({
        next: () => this.carregarTarefas(),
        error: () => this.loadingService.hide(),
      });
    });
  }

  excluirTarefa(tarefa: Tarefa): void {
    const data: ConfirmDialogData = {
      titulo: 'Excluir tarefa?',
      mensagem: `A tarefa "${tarefa.titulo}" será apagada. Essa ação não pode ser desfeita.`,
    };

    this.dialog.open(ConfirmDialogComponent, { width: '400px', panelClass: 'app-dialog-panel', data })
      .afterClosed().subscribe((confirmado) => {
        if (!confirmado) return;

        this.loadingService.show('Excluindo tarefa...');
        this.tarefasService.deleteTarefa(tarefa.id).subscribe({
          next: () => this.carregarTarefas(),
          error: () => this.loadingService.hide(),
        });
      });
  }
}
