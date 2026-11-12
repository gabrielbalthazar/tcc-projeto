import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MeusProjetosComponent } from './meus-projetos/meus-projetos.component';

const routes: Routes = [
  { path: '', component: MeusProjetosComponent }
];

@NgModule({
  declarations: [MeusProjetosComponent],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule.forChild(routes),
  ]
})
export class MeusProjetosModule { }
