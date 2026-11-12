import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Projeto, ProjetoStatus } from '../../core/models/projeto.model';
import { ProjetosService } from '../../projetos/services/projetos.service';
import { LoadingService } from '../../shared/components/services/loading.service';

type FiltroStatus = 'ativos' | 'todos' | ProjetoStatus;

interface StatusInfo {
  label: string;
  badge: string;
  icone: string;
  mensagem: string;
}

const STATUS_ENCERRADOS: ProjetoStatus[] = ['aprovado', 'cancelado'];

const STATUS_INFO: Record<ProjetoStatus, StatusInfo> = {
  em_revisao: {
    label: 'Em revisão',
    badge: 'badge-revisao',
    icone: 'schedule',
    mensagem: 'Nova versão aguardando sua avaliação',
  },
  em_andamento: {
    label: 'Em andamento',
    badge: 'badge-andamento',
    icone: 'movie',
    mensagem: 'O editor está trabalhando no material',
  },
  pausado: {
    label: 'Pausado',
    badge: 'badge-neutro',
    icone: 'pause_circle',
    mensagem: 'Projeto pausado pelo editor',
  },
  aprovado: {
    label: 'Aprovado',
    badge: 'badge-aprovado',
    icone: 'check_circle',
    mensagem: 'Material aprovado',
  },
  cancelado: {
    label: 'Cancelado',
    badge: 'badge-neutro',
    icone: 'cancel',
    mensagem: 'Projeto cancelado',
  },
  rascunho: {
    label: 'Rascunho',
    badge: 'badge-neutro',
    icone: 'edit_note',
    mensagem: 'Projeto em preparação',
  },
};

@Component({
  selector: 'app-meus-projetos',
  templateUrl: './meus-projetos.component.html',
  styleUrls: ['./meus-projetos.component.scss'],
  standalone: false,
})
export class MeusProjetosComponent implements OnInit {
  projetos: Projeto[] = [];
  projetosFiltrados: Projeto[] = [];

  busca = '';
  filtro: FiltroStatus = 'ativos';

  readonly filtros: { label: string; value: FiltroStatus }[] = [
    { label: 'Todos os ativos', value: 'ativos' },
    { label: 'Em revisão', value: 'em_revisao' },
    { label: 'Em andamento', value: 'em_andamento' },
    { label: 'Pausados', value: 'pausado' },
    { label: 'Aprovados', value: 'aprovado' },
    { label: 'Todos os projetos', value: 'todos' },
  ];

  constructor(
    private projetosService: ProjetosService,
    private loadingService: LoadingService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadingService.show('Carregando projetos...');
    this.projetosService.getProjetos().subscribe({
      next: (projetos) => {
        this.projetos = projetos;
        this.aplicarFiltros();
        this.loadingService.hide();
      },
      error: () => this.loadingService.hide(),
    });
  }

  get totalAtivos(): number {
    return this.projetos.filter(p => this.ativo(p)).length;
  }

  info(projeto: Projeto): StatusInfo {
    return STATUS_INFO[projeto.status];
  }

  aguardandoAvaliacao(projeto: Projeto): boolean {
    return projeto.status === 'em_revisao';
  }

  formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  onBusca(event: Event): void {
    this.busca = (event.target as HTMLInputElement).value;
    this.aplicarFiltros();
  }

  onFiltro(event: Event): void {
    this.filtro = (event.target as HTMLSelectElement).value as FiltroStatus;
    this.aplicarFiltros();
  }

  abrirProjeto(projeto: Projeto): void {
    this.router.navigate(['/portal/projetos', projeto.id]);
  }

  private ativo(projeto: Projeto): boolean {
    return !STATUS_ENCERRADOS.includes(projeto.status);
  }

  private aplicarFiltros(): void {
    const termo = this.busca.trim().toLowerCase();

    this.projetosFiltrados = this.projetos.filter(projeto => {
      const combinaBusca = !termo
        || projeto.nome.toLowerCase().includes(termo)
        || (projeto.descricao ?? '').toLowerCase().includes(termo);

      const combinaFiltro = this.filtro === 'todos'
        || (this.filtro === 'ativos' ? this.ativo(projeto) : projeto.status === this.filtro);

      return combinaBusca && combinaFiltro;
    });
  }
}
