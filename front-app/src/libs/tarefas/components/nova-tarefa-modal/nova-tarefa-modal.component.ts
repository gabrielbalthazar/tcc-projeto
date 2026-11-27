import { ChangeDetectorRef, Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateTarefaPayload, Tarefa, TarefaPrioridade, TarefaStatus } from '../../../core/models/tarefa.model';
import { Projeto } from '../../../core/models/projeto.model';
import { ProjetosService } from '../../../projetos/services/projetos.service';

@Component({
  selector: 'app-nova-tarefa-modal',
  standalone: false,
  templateUrl: './nova-tarefa-modal.component.html',
  styleUrls: ['./nova-tarefa-modal.component.scss'],
})
export class NovaTarefaModalComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  projetos: Projeto[] = [];

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
    private projetosService: ProjetosService,
    private cdr: ChangeDetectorRef,
    /** Presente apenas na edição. */
    @Optional() @Inject(MAT_DIALOG_DATA) public tarefa: Tarefa | null,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.projetosService.getProjetos().subscribe(p => {
      this.projetos = p;
      this.cdr.markForCheck(); // app sem zone.js: avisa que há dados novos para desenhar
    });
  }

  createForm(): void {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descricao: [''],
      prioridade: ['media', Validators.required],
      projetoId: ['', Validators.required],
      status: ['pendente', Validators.required],
    });

    if (this.tarefa) {
      this.form.patchValue(this.tarefa);
    }
  }

  get titulo() { return this.form.get('titulo')!; }
  get projetoId() { return this.form.get('projetoId')!; }

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
