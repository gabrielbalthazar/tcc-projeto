import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';
import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteModalComponent } from './components/cliente-modal/cliente-modal.component';

@NgModule({
  declarations: [
    ClientesComponent,
    ClienteModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ClientesRoutingModule,
    MatIconModule,
    MatDialogModule,
  ]
})
export class ClientesModule { }
