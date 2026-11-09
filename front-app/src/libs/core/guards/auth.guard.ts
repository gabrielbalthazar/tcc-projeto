import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../models/user.model';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth']);
  return false;
};

export const roleGuard = (role: UserRole): CanActivateFn => () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getUserRole() === role) {
    return true;
  }

  return router.parseUrl(authService.isAuthenticated() ? authService.getHomeRoute() : '/auth');
};
