import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-formatted-readonly-number',
  template: `<input type="text" class="form-control text-right" [value]="number | number:'1.2-2'" readonly>`,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FormattedReadonlyNumberComponent),
    multi: true,
  }]
})
export class FormattedReadonlyNumberComponent implements ControlValueAccessor {

  public number: number;

  writeValue(obj: any): void {
    this.number = obj;
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }
}
