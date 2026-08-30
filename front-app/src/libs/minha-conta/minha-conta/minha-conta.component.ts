import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoadingService } from '../../shared/components/services/loading.service';
import { User, UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-minha-conta',
  templateUrl: './minha-conta.component.html',
  styleUrls: ['./minha-conta.component.scss'],
  standalone: false,
})
export class MinhaContaComponent implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadingService.show('Carregando perfil...');
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.loadingService.hide();
      },
      error: () => this.loadingService.hide(),
    });
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

  get tipoLabel(): string {
    const labels: Record<UserRole, string> = {
      editor: 'Editor',
      cliente: 'Cliente',
    };
    return this.user ? labels[this.user.tipo] : '';
  }

  sair(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
