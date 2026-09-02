import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  editando = false;

  readonly form;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      cargo: [''],
    });
  }

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

  abrirEdicao(): void {
    if (!this.user) return;
    this.form.reset({
      nome: this.user.nome,
      email: this.user.email,
      telefone: this.user.telefone ?? '',
      cargo: this.user.cargo ?? '',
    });
    this.editando = true;
  }

  cancelarEdicao(): void {
    this.editando = false;
  }

  salvar(): void {
    if (this.form.invalid || !this.user) {
      this.form.markAllAsTouched();
      return;
    }

    const { nome, email, telefone, cargo } = this.form.getRawValue();

    this.loadingService.show('Salvando alterações...');
    this.authService.updateCurrentUser({
      nome: (nome ?? '').trim(),
      email: (email ?? '').trim(),
      telefone: (telefone ?? '').trim() || undefined,
      cargo: (cargo ?? '').trim() || undefined,
    }).subscribe({
      next: (user) => {
        this.user = user;
        this.editando = false;
        this.loadingService.hide();
      },
      error: () => this.loadingService.hide(),
    });
  }

  sair(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
