import { inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { UserRole } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth']);
  return false;
};

export const roleGuard = (role: UserRole): CanActivateFn => () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return checkRole(role, authService, router);
};

export const roleMatchGuard = (role: UserRole): CanMatchFn => () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return checkRole(role, authService, router);
};

function checkRole(role: UserRole, authService: AuthService, router: Router) {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (!authService.isAuthenticated()) {
    return router.parseUrl('/auth');
  }

  return authService.getCurrentUser().pipe(
    map(user => user.tipo === role
      ? true
      : router.parseUrl(user.tipo === 'cliente' ? '/portal' : '/dashboard')),
    catchError(() => of(router.parseUrl('/auth'))),
  );
};
