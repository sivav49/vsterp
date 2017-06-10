import {Observable} from 'rxjs/Observable';
import {DialogRef} from 'angular2-modal';
import {Modal, TwoButtonPreset} from 'angular2-modal/plugins/bootstrap';
import {Injectable} from '@angular/core';

export enum PopupResult {
  Ok,
  Cancel
}

export class ConfirmationResult<T> {
  public data: T;

  constructor(private result: PopupResult) {
  }

  isOkay() {
    return this.result === PopupResult.Ok;
  }

}

@Injectable()
export class PopupService<T> {

  constructor(private modal: Modal) {
  }

  deleteConfirmation(clientId): Observable<ConfirmationResult<T>> {
    return Observable.fromPromise(this.modal.confirm()
      .size('sm')
      .isBlocking(true)
      .showClose(true)
      .keyboard(27)
      .title('Delete Client Confirmation')
      .body('<p>Are you sure you want to delete?</p><p>' + clientId + '</p>')
      .okBtn('Delete')
      .okBtnClass('btn btn-danger')
      .open()
      .catch(err => alert('ERROR'))
      .then((dialog: DialogRef<TwoButtonPreset>) => dialog.result)
      .then(() => new ConfirmationResult(PopupResult.Ok))
      .catch(() => new ConfirmationResult(PopupResult.Cancel))
    );
  }
}
