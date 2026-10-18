import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoadingService } from '../../shared/components/services/loading.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  standalone: false,
})
export class LoginFormComponent {
  form!: FormGroup;
  showPassword = false;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingService: LoadingService,
    private router: Router,
  ) {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      lembrarMe: [false],
    });
  }

  enviaRequest(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.loading = true;
    this.loadingService.show('Entrando...');
    this.authService.login(this.form.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.loadingService.hide();
        this.router.navigate([res.user.tipo === 'cliente' ? '/portal' : '/dashboard']);
      },

      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.loadingService.hide();
        this.errorMessage = err.error?.message ?? 'Nao foi possivel entrar. Tente novamente.';
      }
    });
  }
}
