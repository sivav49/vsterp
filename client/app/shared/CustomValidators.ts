import {AbstractControl, ValidationErrors} from '@angular/forms';
import * as moment from 'moment';

export class CustomValidators {
  static date(control: AbstractControl): ValidationErrors | null {
    const isValid = moment(control.value, 'DD-MM-YYYY', true).isValid();
    return !isValid ? {'invalidDate': true} : null;
  }
}
