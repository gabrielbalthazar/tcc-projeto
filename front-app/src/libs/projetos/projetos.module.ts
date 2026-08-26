import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';
import { ProjetosRoutingModule } from './projetos-routing.module';
import { ProjetosComponent } from './projetos/projetos.component';
import { ProjetoCardComponent } from './components/projeto-card/projeto-card.component';
import { NovoProjetoModalComponent } from './components/novo-projeto-modal/novo-projeto-modal.component';

@NgModule({
  declarations: [
    ProjetosComponent,
    ProjetoCardComponent,
    NovoProjetoModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProjetosRoutingModule,
    MatIconModule,
    MatDialogModule,
  ]
})
export class ProjetosModule { }
