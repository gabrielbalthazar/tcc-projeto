import { ChangeDetectorRef, Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Projeto, ProjetoStatus } from '../../../core/models/projeto.model';
import { Cliente } from '../../../core/models/cliente.model';
import { ClientesService } from '../../../clientes/services/clientes.service';

@Component({
  selector: 'app-novo-projeto-modal',
  standalone: false,
  templateUrl: './novo-projeto-modal.component.html',
  styleUrls: ['./novo-projeto-modal.component.scss'],
})
export class NovoProjetoModalComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  clientes: Cliente[] = [];

  readonly status: { label: string; value: ProjetoStatus }[] = [
    { label: 'Rascunho', value: 'rascunho' },
    { label: 'Em andamento', value: 'em_andamento' },
    { label: 'Em revisão', value: 'em_revisao' },
    { label: 'Pausado', value: 'pausado' },
    { label: 'Aprovado', value: 'aprovado' },
    { label: 'Cancelado', value: 'cancelado' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NovoProjetoModalComponent>,
    private clientesService: ClientesService,
    private cdr: ChangeDetectorRef,
    /** Presente apenas na edição. */
    @Optional() @Inject(MAT_DIALOG_DATA) public projeto: Projeto | null,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.clientesService.getClientes().subscribe(c => {
      this.clientes = c;
      this.cdr.markForCheck(); // app sem zone.js: avisa que há dados novos para desenhar
    });
  }

  createForm(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      clienteId: ['', Validators.required],
      prazo: ['', Validators.required],
      descricao: [''],
      status: ['rascunho'],
    });

    if (this.projeto) {
      this.form.patchValue(this.projeto);
    }
  }

  get nome() { return this.form.get('nome')!; }
  get clienteId() { return this.form.get('clienteId')!; }
  get prazo() { return this.form.get('prazo')!; }
  get descricao() { return this.form.get('descricao')!; }

  close(): void {
    this.dialogRef.close();
  }

  criar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { status, ...dados } = this.form.value;
    // Na criação o status é definido pelo back-end; o progresso é sempre calculado por ele.
    this.dialogRef.close(this.projeto ? { ...dados, status, progresso: this.projeto.progresso } : dados);
  }
}
