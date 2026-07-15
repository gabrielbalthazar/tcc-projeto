import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

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
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Projetos', icon: 'folder_open', route: '/projetos' },
    { label: 'Tarefas', icon: 'format_list_bulleted', route: '/tarefas' },
    { label: 'Timeline', icon: 'timeline', route: '/timeline' },
  ];

  constructor(
    private router: Router
  ) { }

  isActive(route: string): boolean {
    return this.router.isActive(route, { paths: 'subset', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' });
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
