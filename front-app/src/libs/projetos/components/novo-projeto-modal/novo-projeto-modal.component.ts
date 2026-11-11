import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateProjetoPayload } from '../../../core/models/projeto.model';
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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NovoProjetoModalComponent>,
    private clientesService: ClientesService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.clientesService.getClientes().subscribe(c => this.clientes = c);
  }

  createForm(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      clienteId: ['', Validators.required],
      prazo: ['', Validators.required],
      descricao: [''],
    });
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

    this.dialogRef.close(this.form.value as CreateProjetoPayload);
  }
}
