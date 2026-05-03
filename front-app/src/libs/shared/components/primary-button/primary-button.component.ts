import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-primary-button',
  standalone: false,
  templateUrl: './primary-button.component.html',
  styleUrl: './primary-button.component.scss',
  providers: [],
})
export class PrimaryButtonComponent {
  @Input() label = 'Confirmar';
  @Input() type: 'button' | 'submit' = 'submit';
  @Input() loading = false;
  @Input() disabled = false;
}
