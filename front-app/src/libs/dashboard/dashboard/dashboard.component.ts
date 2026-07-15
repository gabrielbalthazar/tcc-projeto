import { Component, OnInit } from '@angular/core';
import { DashboardData, StatCard, ProjetoProgresso, PrazoProximo } from '../../core/models/dashboard.model';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  stats: StatCard[] = [];
  projetos: ProjetoProgresso[] = [];
  prazos: PrazoProximo[] = [];

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.dashboardService.getData().subscribe(data => {
      this.stats = data.stats;
      this.projetos = data.projetos;
      this.prazos = data.prazos;
    });
  }
}
