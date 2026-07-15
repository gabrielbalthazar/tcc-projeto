import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: false,
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
  providers: [],
})
export class StatCardComponent {
  @Input() icon = '';
  @Input() value = 0;
  @Input() label = '';
  @Input() color = '#7c3aed';

  get colorLight(): string {
    return this.color + '1a';
  }
}
