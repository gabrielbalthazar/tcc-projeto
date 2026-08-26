import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Projeto, ProjetoStatus, CreateProjetoPayload } from '../../core/models/projeto.model';
import { ProjetosService } from '../services/projetos.service';
import { LoadingService } from '../../shared/components/services/loading.service';
import { NovoProjetoModalComponent } from '../components/novo-projeto-modal/novo-projeto-modal.component';

interface StatusFilter {
  label: string;
  value: ProjetoStatus | 'todos';
}

@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.component.html',
  styleUrls: ['./projetos.component.scss'],
  standalone: false,
})
export class ProjetosComponent implements OnInit {
  projetos: Projeto[] = [];
  projetosFiltrados: Projeto[] = [];

  busca = '';
  statusSelecionado: ProjetoStatus | 'todos' = 'todos';

  readonly statusFilters: StatusFilter[] = [
    { label: 'Todos', value: 'todos' },
    { label: 'Em andamento', value: 'em_andamento' },
    { label: 'Em revisão', value: 'em_revisao' },
    { label: 'Pausado', value: 'pausado' },
    { label: 'Aprovado', value: 'aprovado' },
    { label: 'Rascunho', value: 'rascunho' },
    { label: 'Cancelado', value: 'cancelado' },
  ];

  constructor(
    private projetosService: ProjetosService,
    private loadingService: LoadingService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.carregarProjetos();
  }

  carregarProjetos(): void {
    this.loadingService.show('Carregando projetos...');
    this.projetosService.getProjetos().subscribe({
      next: (projetos) => {
        this.projetos = projetos;
        this.aplicarFiltros();
        this.loadingService.hide();
      },
      error: () => {
        this.loadingService.hide();
      }
    });
  }

  aplicarFiltros(): void {
    const termo = this.busca.trim().toLowerCase();

    this.projetosFiltrados = this.projetos.filter((projeto) => {
      const combinaBusca = !termo
        || projeto.nome.toLowerCase().includes(termo)
        || projeto.cliente.toLowerCase().includes(termo);

      const combinaStatus = this.statusSelecionado === 'todos'
        || projeto.status === this.statusSelecionado;

      return combinaBusca && combinaStatus;
    });
  }

  onBusca(event: Event): void {
    this.busca = (event.target as HTMLInputElement).value;
    this.aplicarFiltros();
  }

  onStatusChange(event: Event): void {
    this.statusSelecionado = (event.target as HTMLSelectElement).value as ProjetoStatus | 'todos';
    this.aplicarFiltros();
  }

  abrirNovoProjeto(): void {
    const dialogRef = this.dialog.open(NovoProjetoModalComponent, {
      width: '420px',
      autoFocus: false,
      panelClass: 'app-dialog-panel',
    });

    dialogRef.afterClosed().subscribe((payload: CreateProjetoPayload | undefined) => {
      if (!payload) return;

      this.loadingService.show('Criando projeto...');
      this.projetosService.createProjeto(payload).subscribe({
        next: () => {
          this.carregarProjetos();
        },
        error: () => {
          this.loadingService.hide();
        }
      });
    });
  }

  enviarAoCliente(id: string): void {
    this.loadingService.show('Enviando ao cliente...');
    this.projetosService.enviarAoCliente(id).subscribe({
      next: () => {
        this.carregarProjetos();
      },
      error: () => {
        this.loadingService.hide();
      }
    });
  }
}
