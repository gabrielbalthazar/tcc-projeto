import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectProgressItemComponent } from '../shared/components/project-progress-item/project-progress-item.component';
import { DeadlineItemComponent } from '../shared/components/deadline-item/deadline-item.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    DashboardComponent,
    ProjectProgressItemComponent,
    DeadlineItemComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    MatIconModule,
  ]
})
export class DashboardModule { }
