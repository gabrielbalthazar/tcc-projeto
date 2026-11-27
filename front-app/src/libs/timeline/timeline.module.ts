import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';
import { TimelineRoutingModule } from './timeline-routing.module';
import { TimelineComponent } from './timeline/timeline.component';

@NgModule({
  declarations: [
    TimelineComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TimelineRoutingModule,
    MatIconModule,
  ]
})
export class TimelineModule { }
