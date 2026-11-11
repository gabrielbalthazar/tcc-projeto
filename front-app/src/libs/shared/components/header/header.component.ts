import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { EDITOR_NAV_ITEMS, NavItem } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  readonly navItems: NavItem[] = EDITOR_NAV_ITEMS;

  user: User | null = null;
  menuOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private elementRef: ElementRef<HTMLElement>,
  ) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => this.user = user);
  }

  get nome(): string {
    return this.user?.nome ?? '';
  }

  get cargo(): string {
    return this.user?.cargo || 'Editor';
  }

  get iniciais(): string {
    return this.nome
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(parte => parte[0])
      .join('')
      .toUpperCase();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.menuOpen && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.menuOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.menuOpen = false;
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, { paths: 'subset', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' });
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  irParaInicio(): void {
    this.router.navigate(['/dashboard']);
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
