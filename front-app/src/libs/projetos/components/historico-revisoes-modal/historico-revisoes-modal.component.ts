import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Projeto } from '../../../core/models/projeto.model';
import { Versao } from '../../../core/models/aprovacao.model';
import { ProjetosService } from '../../services/projetos.service';

interface StatusVersaoMeta {
  label: string;
  classe: string;
  icone: string;
}

const STATUS_VERSAO: Record<Versao['status'], StatusVersaoMeta> = {
  aguardando_revisao: { label: 'Aguardando cliente', classe: 'status-aguardando', icone: 'schedule' },
  ajustes_solicitados: { label: 'Ajustes solicitados', classe: 'status-ajustes', icone: 'replay' },
  aprovada: { label: 'Aprovada', classe: 'status-aprovada', icone: 'check_circle' },
};

@Component({
  selector: 'app-historico-revisoes-modal',
  standalone: false,
  templateUrl: './historico-revisoes-modal.component.html',
  styleUrls: ['./historico-revisoes-modal.component.scss'],
})
export class HistoricoRevisoesModalComponent implements OnInit {
  versoes: Versao[] = [];
  carregando = true;
  erro = false;

  constructor(
    private dialogRef: MatDialogRef<HistoricoRevisoesModalComponent>,
    private projetosService: ProjetosService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public projeto: Projeto,
  ) { }

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = false;
    this.projetosService.getVersoes(this.projeto.id).subscribe({
      next: (versoes) => {
        this.versoes = [...versoes].sort((a, b) => b.numero - a.numero);
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.carregando = false;
        this.erro = true;
        this.cdr.markForCheck();
      },
    });
  }

  get totalAjustes(): number {
    return this.versoes.filter(v => v.status === 'ajustes_solicitados').length;
  }

  get aprovada(): Versao | undefined {
    return this.versoes.find(v => v.status === 'aprovada');
  }

  meta(versao: Versao): StatusVersaoMeta {
    return STATUS_VERSAO[versao.status];
  }

  fechar(): void {
    this.dialogRef.close();
  }

  trackByVersao(_index: number, versao: Versao): string {
    return versao.id;
  }
}
