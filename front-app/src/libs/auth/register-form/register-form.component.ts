import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/user.model';
import { LoadingService } from '../../shared/components/services/loading.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  standalone: false,
})
export class RegisterFormComponent {
  form!: FormGroup;
  role: UserRole = 'editor';
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
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      tipo: ['editor'],
    });
  }

  setRole(role: UserRole): void {
    this.role = role;
    this.form.patchValue({ tipo: role });
  }

  enviaRequest(): void {
    console.log('[DEBUG] enviaRequest chamado', {
      valid: this.form.valid,
      value: this.form.value,
      errors: Object.fromEntries(
        Object.entries(this.form.controls).map(([k, c]) => [k, c.errors])
      ),
    });

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.loading = true;
    this.loadingService.show('Criando conta...');
    this.authService.register(this.form.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.loadingService.hide();
        this.router.navigate([res.user.tipo === 'cliente' ? '/portal' : '/dashboard']);
      },

      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.loadingService.hide();
        this.errorMessage = err.error?.message ?? 'Nao foi possivel criar a conta. Tente novamente.';
      }
    });
  }
}
