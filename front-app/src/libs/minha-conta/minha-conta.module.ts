import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';
import { MinhaContaRoutingModule } from './minha-conta-routing.module';
import { MinhaContaComponent } from './minha-conta/minha-conta.component';

@NgModule({
  declarations: [
    MinhaContaComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MinhaContaRoutingModule,
    MatIconModule,
  ]
})
export class MinhaContaModule { }
