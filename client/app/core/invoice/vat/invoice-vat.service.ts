import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {ToastsManager} from 'ng2-toastr';

import {InvoiceVat} from './invoice-vat.model';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {ConfirmationResult, PopupService} from '../../../shared/popup.service';

@Injectable()
export class InvoiceVatService {
  private apiUrl = 'http://192.168.1.104:4300/api/invoices';

  public active: InvoiceVat;

  private static extractData(res: Response) {
    const body = res.json();
    return body.data || {};
  }

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
              private popup: PopupService<InvoiceVat>) {
  }

  getAll(): Observable<InvoiceVat[]> {
    return this.http.get(this.apiUrl)
      .map(res => InvoiceVatService.extractData(res) as Array<InvoiceVat>)
      .catch(InvoiceVatService.handleError);
  }

  get(index: number): Observable<InvoiceVat> {
    return this.http.get(this.apiUrl + '/' + index)
      .map(res => InvoiceVatService.extractData(res) as InvoiceVat)
      .catch(InvoiceVatService.handleError);
  }

  create(invoice: InvoiceVat): Observable<InvoiceVat> {
    const request = this.http.post(this.apiUrl, JSON.stringify(invoice), InvoiceVatService.getJSONHeader());
    return this.handleResponse(request, 'created successfully', 'An error occurred');
  }

  update(_id: number, invoice: InvoiceVat): Observable<InvoiceVat> {
    const request = this.http.put(this.apiUrl + '/' + _id, JSON.stringify(invoice), InvoiceVatService.getJSONHeader());
    return this.handleResponse(request, 'updated successfully', 'An error occurred');
  }

  remove(_id: string): Observable<InvoiceVat> {
    const request = this.http.delete(this.apiUrl + '/' + _id);
    return this.handleResponse(request, 'deleted successfully', 'An Error occurred');
  }

  removeConfirmation(invoiceId: string): Observable<ConfirmationResult<InvoiceVat>> {
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
          const invoice = InvoiceVatService.extractData(res) as InvoiceVat;
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
          return InvoiceVatService.handleError(res);
        }
      );
  }
}

@Injectable()
export class InvoiceVatGetResolve implements Resolve<InvoiceVat> {

  constructor(private router: Router,
              private invoiceService: InvoiceVatService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): InvoiceVat | Observable<InvoiceVat> | Promise<InvoiceVat> {
    const invoiceId = route.params['id'];
    return this.invoiceService.get(invoiceId).map(
      invoice => {
        if (invoice) {
          return invoice;
        } else {
          this.router.navigate(['404']);
          return invoice;
        }
      }
    );
  }
}
