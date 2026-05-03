import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingService: LoadingService,
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loadingService.show('Entrando...');
    this.authService.register(this.form.value).subscribe({
      next: (res) => {
        console.log('Cadastrado!', res);
        this.loading = false;
      },

      error: () => {
        this.loadingService.hide();
      }
    });
  }
}
