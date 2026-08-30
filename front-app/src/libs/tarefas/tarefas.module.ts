import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../shared/shared.module';
import { TarefasRoutingModule } from './tarefas-routing.module';
import { TarefasComponent } from './tarefas/tarefas.component';
import { TarefaCardComponent } from './components/tarefa-card/tarefa-card.component';
import { NovaTarefaModalComponent } from './components/nova-tarefa-modal/nova-tarefa-modal.component';

@NgModule({
  declarations: [
    TarefasComponent,
    TarefaCardComponent,
    NovaTarefaModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TarefasRoutingModule,
    MatIconModule,
    MatDialogModule,
    DragDropModule,
  ]
})
export class TarefasModule { }
