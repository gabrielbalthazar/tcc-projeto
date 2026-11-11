import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cliente, ClientePayload } from '../../../core/models/cliente.model';
import { ClientesService } from '../../services/clientes.service';

export interface ClienteModalData {
  cliente?: Cliente;
}

@Component({
  selector: 'app-cliente-modal',
  standalone: false,
  templateUrl: './cliente-modal.component.html',
  styleUrls: ['./cliente-modal.component.scss'],
})
export class ClienteModalComponent {
  form: FormGroup;
  salvando = false;
  erroGeral = '';
  erroEmail = '';

  readonly cliente?: Cliente;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClienteModalComponent, Cliente>,
    private clientesService: ClientesService,
    @Inject(MAT_DIALOG_DATA) data: ClienteModalData,
  ) {
    this.cliente = data?.cliente;

    this.form = this.fb.group({
      nome: [this.cliente?.nome ?? '', [Validators.required, Validators.maxLength(120)]],
      empresa: [this.cliente?.empresa ?? '', Validators.maxLength(120)],
      email: [this.cliente?.email ?? '', [Validators.required, Validators.email]],
      telefone: [this.cliente?.telefone ?? '', Validators.maxLength(30)],
      observacoes: [this.cliente?.observacoes ?? '', Validators.maxLength(2000)],
    });

    if (this.cliente && !this.cliente.emailEditavel) {
      this.form.get('email')!.disable();
    }

    this.form.get('email')!.valueChanges.subscribe(() => this.erroEmail = '');
  }

  get editando(): boolean {
    return !!this.cliente;
  }

  get emailHint(): string {
    if (!this.editando) {
      return 'Se o cliente já tiver conta no TakeHub, ele será adicionado à sua lista.';
    }
    return this.form.get('email')!.disabled
      ? 'Este e-mail é o acesso do cliente e não pode mais ser alterado aqui.'
      : '';
  }

  close(): void {
    this.dialogRef.close();
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.erroGeral = '';

    const payload = this.form.getRawValue() as ClientePayload;
    const request$ = this.cliente
      ? this.clientesService.updateCliente(this.cliente.id, payload)
      : this.clientesService.createCliente(payload);

    request$.subscribe({
      next: (salvo) => this.dialogRef.close(salvo),
      error: (err: HttpErrorResponse) => {
        this.salvando = false;
        if (err.status === 409) {
          this.erroEmail = err.error?.message ?? 'Não foi possível usar este e-mail.';
        } else {
          this.erroGeral = err.error?.message ?? 'Não foi possível salvar o cliente. Tente novamente.';
        }
      },
    });
  }
}
