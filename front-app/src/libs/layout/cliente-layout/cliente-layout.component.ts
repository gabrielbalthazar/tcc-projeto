import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Projeto, ProjetoStatus } from '../../core/models/projeto.model';
import { ProjetosService } from '../../projetos/services/projetos.service';
import { SidebarProjeto } from '../../shared/components/sidebar/sidebar.component';

const MOBILE_BREAKPOINT = 768;

const STATUS_LABEL: Record<ProjetoStatus, string> = {
  em_revisao: 'Aguardando avaliação',
  em_andamento: 'Em andamento',
  pausado: 'Pausado',
  aprovado: 'Aprovado',
  cancelado: 'Cancelado',
  rascunho: 'Rascunho',
};

@Component({
  selector: 'app-cliente-layout',
  standalone: false,
  templateUrl: './cliente-layout.component.html',
  styleUrl: './cliente-layout.component.scss',
})
export class ClienteLayoutComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  projeto: SidebarProjeto | null = null;

  private isMobile = false;
  private subscription?: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly projetosService: ProjetosService,
  ) { }

  ngOnInit(): void {
    this.checkViewport();

    this.subscription = this.route.paramMap
      .pipe(switchMap(params => this.projetosService.getProjeto(params.get('projetoId')!)))
      .subscribe({
        next: (projeto) => this.projeto = this.toSidebarProjeto(projeto),
        error: () => this.router.navigate(['/portal/projetos']),
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkViewport();
  }

  private toSidebarProjeto(projeto: Projeto): SidebarProjeto {
    return {
      nome: projeto.nome,
      statusLabel: STATUS_LABEL[projeto.status],
      statusTipo: projeto.status === 'aprovado'
        ? 'aprovado'
        : projeto.status === 'cancelado' ? 'ajustes' : 'pendente',
    };
  }

  private checkViewport(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
    if (mobile !== this.isMobile) {
      this.isMobile = mobile;
      this.sidebarCollapsed = mobile;
    }
  }
}
