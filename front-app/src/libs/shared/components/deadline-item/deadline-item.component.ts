import { Component, Input } from '@angular/core';
import { PrazoProximo } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-deadline-item',
  standalone: false,
  templateUrl: './deadline-item.component.html',
  styleUrls: ['./deadline-item.component.scss'],
})
export class DeadlineItemComponent {
  @Input() prazo!: PrazoProximo;
}
