import {
  Component, Input, OnInit, Optional, Self
} from '@angular/core';
import {
  ControlValueAccessor, NgControl, ValidationErrors
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export type InputType = 'text' | 'email' | 'password' | 'textarea' | 'date';

@Component({
  selector: 'app-input-field',
  standalone: false,
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
})
export class InputFieldComponent implements ControlValueAccessor, OnInit {

  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: InputType = 'text';
  @Input() prefixIcon = '';
  @Input() hint = '';
  @Input() maxLength?: number;
  @Input() minLength?: number;
  @Input() pattern?: string;

  @Input() errorRequired = 'Este campo é obrigatório.';
  @Input() errorEmail = 'Informe um e-mail válido.';
  @Input() errorMin = '';
  @Input() errorMax = '';
  @Input() errorPattern = 'Formato inválido.';

  showPassword = false;

  // O matInput interno não tem FormControl próprio; usa o estado do controle externo
  // para que o mat-form-field fique vermelho e exiba os <mat-error>.
  errorStateMatcher: ErrorStateMatcher = {
    isErrorState: () => !!this.errors,
  };
  value = '';
  disabled = false;

  private onChange: (v: string) => void = () => { };
  private onTouched: () => void = () => { };

  constructor(@Optional() @Self() private ngControl?: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    if (!this.errorMin && this.minLength) {
      this.errorMin = `Mínimo de ${this.minLength} caracteres.`;
    }
    if (!this.errorMax && this.maxLength) {
      this.errorMax = `Máximo de ${this.maxLength} caracteres.`;
    }
  }

  get errors(): ValidationErrors | null {
    const control = this.ngControl?.control;
    const result = (!control || !(control.touched || control.dirty)) ? null : control.errors;
    return result;
  }

  get currentLength(): number {
    return this.value?.length ?? 0;
  }

  //controla o visualizador da senha
  get resolvedType(): string {
    if (this.type === 'password') return this.showPassword ? 'text' : 'password';
    return this.type;
  }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(val: string): void {
    this.value = val ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(d: boolean): void {
    this.disabled = d;
  }
}
