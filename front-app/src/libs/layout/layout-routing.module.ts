import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'projetos',
        loadChildren: () =>
          import('../projetos/projetos.module').then(m => m.ProjetosModule)
      },
      {
        path: 'tarefas',
        loadChildren: () =>
          import('../tarefas/tarefas.module').then(m => m.TarefasModule)
      },
      {
        path: 'timeline',
        loadChildren: () =>
          import('../timeline/timeline.module').then(m => m.TimelineModule)
      },
      {
        path: 'minha-conta',
        loadChildren: () =>
          import('../minha-conta/minha-conta.module').then(m => m.MinhaContaModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
