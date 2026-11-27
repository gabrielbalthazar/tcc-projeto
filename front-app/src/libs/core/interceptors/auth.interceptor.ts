import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notifications = inject(NotificationService);
  const router = inject(Router);
  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return EMPTY;
  }
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
      if (!isAuthRoute) {
        notifications.showError(
          err.error?.message ?? `Não foi possível concluir a operação (erro ${err.status || 'de conexão'}).`,
        );
      }
      return throwError(() => err);
    }),
  );
};
