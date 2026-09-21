import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function roomCodeFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = (control.value ?? '').toUpperCase();
    const valid = /^[A-Z0-9]{5}$/.test(value);
    return valid ? null : { roomCodeFormat: true };
  };
}