import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AprovacaoService } from '../../aprovacao/services/aprovacao.service';
import { MaterialStatus } from '../../core/models/aprovacao.model';
import { SidebarProjeto, SidebarUsuario } from '../../shared/components/sidebar/sidebar.component';

const MOBILE_BREAKPOINT = 768;

@Component({
  selector: 'app-cliente-layout',
  standalone: false,
  templateUrl: './cliente-layout.component.html',
  styleUrl: './cliente-layout.component.scss',
})
export class ClienteLayoutComponent implements OnInit {
  sidebarCollapsed = false;

  empresa: string | null = null;
  usuario: SidebarUsuario | null = null;
  projeto: SidebarProjeto | null = null;

  private isMobile = false;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly aprovacaoService: AprovacaoService,
  ) { }

  ngOnInit(): void {
    this.checkViewport();

    this.aprovacaoService.getMaterial().subscribe((material) => {
      this.empresa = material.empresa;
      this.usuario = material.cliente;
      this.projeto = {
        nome: material.projeto,
        versao: `Versão ${material.versaoAtual}`,
        statusLabel: this.statusLabel(material.status),
        statusTipo: this.statusTipo(material.status),
      };
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkViewport();
  }

  private statusLabel(status: MaterialStatus): string {
    const labels: Record<MaterialStatus, string> = {
      pendente: 'Pendente',
      aprovado: 'Aprovado',
      ajustes_solicitados: 'Ajustes solicitados',
    };
    return labels[status];
  }

  private statusTipo(status: MaterialStatus): SidebarProjeto['statusTipo'] {
    if (status === 'aprovado') return 'aprovado';
    if (status === 'ajustes_solicitados') return 'ajustes';
    return 'pendente';
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
