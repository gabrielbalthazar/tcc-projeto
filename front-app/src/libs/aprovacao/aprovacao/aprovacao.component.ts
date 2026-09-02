import { Component, OnInit } from '@angular/core';
import { AprovacaoService } from '../services/aprovacao.service';
import { LoadingService } from '../../shared/components/services/loading.service';
import {
  AprovacaoDecisao,
  MaterialAprovacao,
} from '../../core/models/aprovacao.model';

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

@Component({
  selector: 'app-aprovacao',
  templateUrl: './aprovacao.component.html',
  styleUrls: ['./aprovacao.component.scss'],
  standalone: false,
})
export class AprovacaoComponent implements OnInit {
  material: MaterialAprovacao | null = null;

  decisao: AprovacaoDecisao | null = null;
  comentario = '';
  videoAberto = false;

  constructor(
    private aprovacaoService: AprovacaoService,
    private loadingService: LoadingService,
  ) { }

  ngOnInit(): void {
    this.loadingService.show('Carregando material...');
    this.aprovacaoService.getMaterial().subscribe({
      next: (material) => {
        this.material = material;
        this.loadingService.hide();
      },
      error: () => this.loadingService.hide(),
    });
  }

  get enviado(): boolean {
    return !!this.material && this.material.status !== 'pendente';
  }

  get aprovado(): boolean {
    return this.material?.status === 'aprovado';
  }

  get podeEnviar(): boolean {
    return !!this.decisao && !this.enviado;
  }

  get dataFormatada(): string {
    const data = this.material?.data;
    if (!data) return '';
    const dia = String(data.getDate()).padStart(2, '0');
    return `${dia} de ${MESES[data.getMonth()]} de ${data.getFullYear()}`;
  }

  get textoBotao(): string {
    if (this.enviado) {
      return this.aprovado ? 'Projeto aprovado' : 'Ajustes solicitados';
    }
    if (!this.decisao) return 'Selecione uma opção acima';
    return this.decisao === 'aprovar'
      ? 'Enviar aprovação'
      : 'Enviar solicitação de ajustes';
  }

  selecionar(decisao: AprovacaoDecisao): void {
    if (this.enviado) return;
    this.decisao = decisao;
  }

  toggleVideo(): void {
    this.videoAberto = !this.videoAberto;
  }

  baixarArquivo(): void {
    const url = this.material?.arquivo.url;
    if (url) {
      window.open(url, '_blank');
    }
  }

  enviar(): void {
    if (!this.podeEnviar || !this.material || !this.decisao) return;

    this.loadingService.show('Enviando avaliação...');
    this.aprovacaoService.enviarAvaliacao({
      materialId: this.material.id,
      decisao: this.decisao,
      comentario: this.comentario,
    }).subscribe({
      next: (material) => {
        this.material = material;
        this.loadingService.hide();
      },
      error: () => this.loadingService.hide(),
    });
  }

  trackByVersao(_index: number, item: { versao: number }): number {
    return item.versao;
  }
}
