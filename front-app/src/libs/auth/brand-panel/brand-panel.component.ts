import { Component } from '@angular/core';

@Component({
  selector: 'app-brand-panel',
  templateUrl: './brand-panel.component.html',
  styleUrls: ['./brand-panel.component.scss'],
  standalone: false,
})
export class BrandPanelComponent {
  metricas = [
    { value: '500+', label: 'Projetos entregues' },
    { value: '98%', label: 'Aprovação' },
    { value: '2x',  label: 'Mais rápido' },
  ];
}
