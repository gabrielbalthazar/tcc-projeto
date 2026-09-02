import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

export type SidebarModo = 'interno' | 'cliente';

export type SidebarProjetoStatus = 'pendente' | 'aprovado' | 'ajustes';

export interface SidebarProjeto {
  nome: string;
  versao: string;
  statusLabel: string;
  statusTipo: SidebarProjetoStatus;
}

export interface SidebarUsuario {
  nome: string;
  email: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;
  @Input() modo: SidebarModo = 'interno';
  @Input() empresa: string | null = null;
  @Input() projeto: SidebarProjeto | null = null;
  @Input() usuario: SidebarUsuario | null = null;
  @Output() toggleSidebar = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Projetos', icon: 'folder_open', route: '/projetos' },
    { label: 'Tarefas', icon: 'format_list_bulleted', route: '/tarefas' },
    { label: 'Timeline', icon: 'timeline', route: '/timeline' },
  ];

  user: User | null = null;
  menuOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => this.user = user);
  }

  get isCliente(): boolean {
    return this.modo === 'cliente';
  }

  get logoSubtitulo(): string {
    return this.isCliente ? 'Portal do Cliente' : 'Gestão de Edição';
  }

  get nomeExibido(): string {
    return this.usuario?.nome ?? this.user?.nome ?? '';
  }

  get contatoExibido(): string {
    return this.isCliente
      ? (this.usuario?.email ?? this.user?.email ?? '')
      : (this.user?.cargo ?? '');
  }

  get minhaContaRoute(): string {
    return this.isCliente ? '/portal/minha-conta' : '/minha-conta';
  }

  get statusIcon(): string {
    switch (this.projeto?.statusTipo) {
      case 'aprovado': return 'check_circle';
      case 'ajustes': return 'cancel';
      default: return 'schedule';
    }
  }

  get iniciais(): string {
    const nome = this.nomeExibido;
    if (!nome) return '';
    return nome
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(parte => parte[0])
      .join('')
      .toUpperCase();
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, { paths: 'subset', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' });
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  irParaMinhaConta(): void {
    this.menuOpen = false;
    this.router.navigate([this.minhaContaRoute]);
  }

  sair(): void {
    this.menuOpen = false;
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
