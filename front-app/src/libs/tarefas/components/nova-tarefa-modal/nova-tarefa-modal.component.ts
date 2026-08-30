import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateTarefaPayload, TarefaPrioridade, TarefaStatus } from '../../../core/models/tarefa.model';

export interface NovaTarefaModalData {
  projetos: string[];
  responsaveis: string[];
}

@Component({
  selector: 'app-nova-tarefa-modal',
  standalone: false,
  templateUrl: './nova-tarefa-modal.component.html',
  styleUrls: ['./nova-tarefa-modal.component.scss'],
})
export class NovaTarefaModalComponent {
  form!: FormGroup;
  loading = false;

  readonly prioridades: { label: string; value: TarefaPrioridade }[] = [
    { label: 'Baixa', value: 'baixa' },
    { label: 'Média', value: 'media' },
    { label: 'Alta', value: 'alta' },
  ];

  readonly status: { label: string; value: TarefaStatus }[] = [
    { label: 'Pendente', value: 'pendente' },
    { label: 'Em Progresso', value: 'em_progresso' },
    { label: 'Revisão', value: 'revisao' },
    { label: 'Concluído', value: 'concluido' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NovaTarefaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NovaTarefaModalData,
  ) {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descricao: [''],
      prioridade: ['media', Validators.required],
      responsavel: ['', Validators.required],
      projeto: ['', Validators.required],
      status: ['pendente', Validators.required],
    });
  }

  get titulo() { return this.form.get('titulo')!; }
  get responsavel() { return this.form.get('responsavel')!; }
  get projeto() { return this.form.get('projeto')!; }

  close(): void {
    this.dialogRef.close();
  }

  criar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.value as CreateTarefaPayload);
  }
}
