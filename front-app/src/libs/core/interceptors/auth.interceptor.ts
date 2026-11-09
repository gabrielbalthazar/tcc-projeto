import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  const request = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {
      // Token ausente, inválido ou expirado: limpa a sessão e volta para o login.
      // O login/cadastro também retornam 401 (credenciais erradas), então eles ficam de fora.
      const isAuthRoute = req.url.includes('/auth/login') || req.url.includes('/auth/register');
      if (err.status === 401 && !isAuthRoute) {
        authService.logout();
        router.navigate(['/auth']);
      }
      return throwError(() => err);
    }),
  );
};
