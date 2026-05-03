import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PrimaryButtonComponent } from './components/primary-button/primary-button.component';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PrimaryButtonComponent,
    InputFieldComponent,
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
  ],
  exports: [
    PrimaryButtonComponent,
    InputFieldComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule {}
