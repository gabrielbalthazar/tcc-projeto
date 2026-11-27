import { Component, Input } from '@angular/core';
import { RevisaoStatus, VersaoHistorico } from '../../../core/models/aprovacao.model';
import { urlDeDownload } from '../../../core/utils/download';

interface StatusMeta {
  label: string;
  icone: string;
}

const STATUS_META: Record<RevisaoStatus, StatusMeta> = {
  pendente: { label: 'Sem avaliação', icone: 'schedule' },
  rejeitada: { label: 'Ajustes solicitados', icone: 'replay' },
  aprovada: { label: 'Aprovada', icone: 'check_circle' },
};

@Component({
  selector: 'app-historico-versoes',
  standalone: false,
  templateUrl: './historico-versoes.component.html',
  styleUrls: ['./historico-versoes.component.scss'],
})
export class HistoricoVersoesComponent {
  @Input() versoes: VersaoHistorico[] = [];
  @Input() editor = '';

  videoAberto: string | null = null;

  meta(versao: VersaoHistorico): StatusMeta {
    return STATUS_META[versao.status];
  }

  alternarVideo(versao: VersaoHistorico): void {
    this.videoAberto = this.videoAberto === versao.id ? null : versao.id;
  }

  baixar(versao: VersaoHistorico): void {
    if (versao.arquivo.url) {
      window.location.assign(urlDeDownload(versao.arquivo.url));
    }
  }

  trackByVersao(_index: number, versao: VersaoHistorico): string {
    return versao.id;
  }
}
