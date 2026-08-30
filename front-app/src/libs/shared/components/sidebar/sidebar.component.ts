import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;
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

  get iniciais(): string {
    if (!this.user?.nome) return '';
    return this.user.nome
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
    this.router.navigate(['/minha-conta']);
  }

  sair(): void {
    this.menuOpen = false;
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
