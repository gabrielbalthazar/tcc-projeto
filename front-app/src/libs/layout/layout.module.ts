import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { ClienteLayoutComponent } from './cliente-layout/cliente-layout.component';
import { LayoutRoutingModule } from './layout-routing.module';

@NgModule({
  declarations: [MainLayoutComponent, ClienteLayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    LayoutRoutingModule,
  ],
  exports: [MainLayoutComponent, ClienteLayoutComponent]
})
export class LayoutModule { }
