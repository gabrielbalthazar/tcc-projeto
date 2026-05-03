import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingService: LoadingService,
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

    this.loadingService.show('Entrando...');
    this.authService.login(this.form.value).subscribe({
      next: (res) => {
        console.log('Logado!', res);
        this.loading = false;
      },

      error: () => {
        this.loadingService.hide();
      }
    });
  }
}
