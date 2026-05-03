import {
  Component, Input, OnInit, Optional, Self, forwardRef
} from '@angular/core';
import {
  ControlValueAccessor, NgControl, AbstractControl,
  ValidationErrors, NG_VALUE_ACCESSOR
} from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'textarea' | 'date';

@Component({
  selector: 'app-input-field',
  standalone: false,
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true
    }
  ]
})
export class InputFieldComponent implements ControlValueAccessor, OnInit {

  @Input() label         = '';
  @Input() placeholder   = '';
  @Input() type: InputType = 'text';
  @Input() prefixIcon    = '';
  @Input() hint          = '';
  @Input() maxLength?: number;
  @Input() minLength?: number;
  @Input() pattern?: string;

  @Input() errorRequired = 'Este campo é obrigatório.';
  @Input() errorEmail    = 'Informe um e-mail válido.';
  @Input() errorMin      = '';
  @Input() errorMax      = '';
  @Input() errorPattern  = 'Formato inválido.';

  showPassword = false;
  value        = '';
  disabled     = false;

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void         = () => {};

  ngOnInit(): void {
    if (!this.errorMin && this.minLength) {
      this.errorMin = `Mínimo de ${this.minLength} caracteres.`;
    }
    if (!this.errorMax && this.maxLength) {
      this.errorMax = `Máximo de ${this.maxLength} caracteres.`;
    }
  }

  get errors(): ValidationErrors | null {
    return null;
  }

  get currentLength(): number {
    return this.value?.length ?? 0;
  }

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

  writeValue(val: string): void       { this.value = val ?? ''; }
  registerOnChange(fn: any): void     { this.onChange = fn; }
  registerOnTouched(fn: any): void    { this.onTouched = fn; }
  setDisabledState(d: boolean): void  { this.disabled = d; }
}
