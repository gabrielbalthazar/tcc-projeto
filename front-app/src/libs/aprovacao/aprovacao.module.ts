import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';
import { AprovacaoRoutingModule } from './aprovacao-routing.module';
import { AprovacaoComponent } from './aprovacao/aprovacao.component';

@NgModule({
  declarations: [
    AprovacaoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    AprovacaoRoutingModule,
    MatIconModule,
  ]
})
export class AprovacaoModule { }
