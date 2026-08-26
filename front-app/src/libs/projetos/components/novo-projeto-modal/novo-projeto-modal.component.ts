import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateProjetoPayload } from '../../../core/models/projeto.model';

@Component({
  selector: 'app-novo-projeto-modal',
  standalone: false,
  templateUrl: './novo-projeto-modal.component.html',
  styleUrls: ['./novo-projeto-modal.component.scss'],
})
export class NovoProjetoModalComponent {
  form!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NovoProjetoModalComponent>,
  ) {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      cliente: ['', Validators.required],
      editor: ['', Validators.required],
      prazo: ['', Validators.required],
      descricao: [''],
    });
  }

  get nome() { return this.form.get('nome')!; }
  get cliente() { return this.form.get('cliente')!; }
  get editor() { return this.form.get('editor')!; }
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
