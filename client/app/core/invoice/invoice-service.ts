import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {ToastsManager} from 'ng2-toastr';

import {Invoice} from './invoice.model';
import {ConfirmationResult, PopupService} from '../../shared/popup.service';

@Injectable()
export class InvoiceService<InvoiceTax extends Invoice> {
  protected apiUrl = '';
  public active: InvoiceTax;

  private static handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      errMsg = `${error.status} - ${error.statusText || ''} ${JSON.stringify(error)}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(error);
  }

  private static getJSONHeader() {
    return new RequestOptions({headers: new Headers({'Content-Type': 'application/json'})});
  }

  constructor(private http: Http,
              private toastr: ToastsManager,
              private popup: PopupService<InvoiceTax>) {
  }

  protected extractData(res: Response) {
    const body = res.json();
    return body.data || {};
  }

  getAll(): Observable<InvoiceTax[]> {
    return this.http.get(this.apiUrl)
      .map(res => this.extractData(res) as Array<InvoiceTax>)
      .catch(InvoiceService.handleError);
  }

  get(index: number): Observable<InvoiceTax> {
    return this.http.get(this.apiUrl + '/' + index)
      .map(res => this.extractData(res) as InvoiceTax)
      .catch(InvoiceService.handleError);
  }

  create(invoice: InvoiceTax): Observable<InvoiceTax> {
    const request = this.http.post(this.apiUrl, JSON.stringify(invoice), InvoiceService.getJSONHeader());
    return this.handleResponse(request, 'created successfully', 'An error occurred');
  }

  update(_id: number, invoice: InvoiceTax): Observable<InvoiceTax> {
    const request = this.http.put(this.apiUrl + '/' + _id, JSON.stringify(invoice), InvoiceService.getJSONHeader());
    return this.handleResponse(request, 'updated successfully', 'An error occurred');
  }

  remove(_id: number): Observable<InvoiceTax> {
    const request = this.http.delete(this.apiUrl + '/' + _id);
    return this.handleResponse(request, 'deleted successfully', 'An Error occurred');
  }

  removeConfirmation(invoiceId: number): Observable<ConfirmationResult<InvoiceTax>> {
    return this.popup.deleteConfirmation(invoiceId)
      .map((popup) => {
        if (popup.isOkay()) {
          return this.remove(invoiceId)
            .map((invoice) => {
              popup.data = invoice;
              return popup;
            });
        } else {
          return Observable.create((obj) => obj.next(popup));
        }
      }).switch();
  }

  private handleResponse(apiCall: Observable<Response>, successMessage: string, errorMessage: string) {
    return apiCall
      .map(
        (res: Response) => {
          const invoice = this.extractData(res) as InvoiceTax;
          if (invoice) {
            this.active = invoice;
            this.toastr.success(invoice._id + ' ' + successMessage);
          }
          return invoice;
        }
      )
      .catch(
        (res: Response) => {
          this.toastr.error(errorMessage);
          return InvoiceService.handleError(res);
        }
      );
  }
}


