import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-formatted-readonly-number',
  template: `<input type="text" class="form-control text-right" [value]="number | number: format" readonly>`,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FormattedReadonlyNumberComponent),
    multi: true,
  }]
})
export class FormattedReadonlyNumberComponent implements ControlValueAccessor {
  @Input('format') format: string;

  public number = 0;

  writeValue(obj: any): void {
    if (obj !== '') {
      this.number = obj;
    }

    if (this.format === undefined || this.format === '' ) {
      this.format = '1.2-2';
    }
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }
}
