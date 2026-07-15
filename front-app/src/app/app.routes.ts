import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('../libs/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    loadChildren: () =>
      import('../libs/layout/layout.module').then(m => m.LayoutModule)
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];
