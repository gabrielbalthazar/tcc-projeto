import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PrimaryButtonComponent } from './components/primary-button/primary-button.component';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';

@NgModule({
  declarations: [
    PrimaryButtonComponent,
    InputFieldComponent,
    StatCardComponent,
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
  ],
  exports: [
    PrimaryButtonComponent,
    InputFieldComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    StatCardComponent,
    SidebarComponent,
    MatTooltipModule,
  ]
})
export class SharedModule { }
