import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Projeto } from '../../../core/models/projeto.model';
import { ProjetosService } from '../../services/projetos.service';

const TAMANHO_MAXIMO = 100 * 1024 * 1024;
const EXTENSOES_ACEITAS = ['mp4', 'mov'];
const TIPOS_ACEITOS = ['video/mp4', 'video/quicktime'];

@Component({
  selector: 'app-enviar-versao-modal',
  standalone: false,
  templateUrl: './enviar-versao-modal.component.html',
  styleUrls: ['./enviar-versao-modal.component.scss'],
})
export class EnviarVersaoModalComponent implements OnDestroy {
  readonly accept = '.mp4,.mov,video/mp4,video/quicktime';

  arquivo: File | null = null;
  mensagem = '';
  erro = '';
  arrastando = false;
  enviando = false;
  progresso = 0;

  private envio?: Subscription;

  constructor(
    private dialogRef: MatDialogRef<EnviarVersaoModalComponent, boolean>,
    private projetosService: ProjetosService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public projeto: Projeto,
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnDestroy(): void {
    this.envio?.unsubscribe();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (this.enviando) return;
    this.arrastando = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.arrastando = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.arrastando = false;
    if (this.enviando) return;
    const arquivo = event.dataTransfer?.files?.[0];
    if (arquivo) this.definirArquivo(arquivo);
  }

  onSelecionar(event: Event): void {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    if (arquivo) this.definirArquivo(arquivo);
    input.value = '';
  }

  removerArquivo(): void {
    this.arquivo = null;
    this.erro = '';
  }

  get extensao(): string {
    return this.arquivo?.name.split('.').pop()?.toUpperCase() ?? '';
  }

  get statusEnvio(): string {
    return this.progresso >= 100 ? 'Processando vídeo…' : `Enviando… ${this.progresso}%`;
  }

  formatarTamanho(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  fechar(): void {
    if (this.enviando) return;
    this.dialogRef.close(false);
  }

  cancelarEnvio(): void {
    this.envio?.unsubscribe();
    this.enviando = false;
    this.progresso = 0;
  }

  enviar(): void {
    if (!this.arquivo || this.enviando) return;
    this.enviando = true;
    this.progresso = 0;
    this.erro = '';

    this.envio = this.projetosService.enviarVersao(this.projeto.id, this.arquivo, this.mensagem.trim()).subscribe({
      next: (evento) => {
        if (evento.type === HttpEventType.UploadProgress && evento.total) {
          this.progresso = Math.round((evento.loaded / evento.total) * 100);
          this.cdr.markForCheck();
        } else if (evento.type === HttpEventType.Response) {
          this.enviando = false;
          this.dialogRef.close(true);
        }
      },
      error: () => {
        this.enviando = false;
        this.progresso = 0;
        this.erro = 'Não foi possível enviar o vídeo. Tente novamente.';
        this.cdr.markForCheck();
      },
    });
  }

  private definirArquivo(arquivo: File): void {
    const extensao = arquivo.name.split('.').pop()?.toLowerCase() ?? '';
    const tipoValido = !arquivo.type || TIPOS_ACEITOS.includes(arquivo.type);

    if (!EXTENSOES_ACEITAS.includes(extensao) || !tipoValido) {
      this.erro = 'Formato não suportado. Envie um vídeo .mp4 ou .mov.';
      return;
    }
    if (arquivo.size > TAMANHO_MAXIMO) {
      this.erro = `O vídeo tem ${this.formatarTamanho(arquivo.size)} e excede o limite de 100 MB.`;
      return;
    }

    this.erro = '';
    this.arquivo = arquivo;
  }
}
