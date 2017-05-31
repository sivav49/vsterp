import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {Invoice} from './invoice.model';

@Injectable()
export class InvoiceService {
  private apiUrl = 'http://192.168.1.104:4300/api/invoices';

  private activeInvoice: Invoice;

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

  constructor(private http: Http) {
  }

  getInvoiceList(): Observable<Invoice[]> {
    return this.http.get(this.apiUrl).map(
      (res) => {
        const invoices = InvoiceService.extractData(res);
        this.activeInvoice = invoices[0];
        return invoices;
      })
      .catch(InvoiceService.handleError);
  }

  getInvoice(index: number): Observable<Invoice> {
    return this.http.get(this.apiUrl + '/' + index).map(
      (res) => {
        const invoice = InvoiceService.extractData(res);
        this.activeInvoice = invoice;
        return invoice;
      })
      .catch(InvoiceService.handleError);
  }

  getActiveInvoice(): Invoice {
    return this.activeInvoice;
  }

  setActiveInvoice(invoice: Invoice) {
    this.activeInvoice = invoice;
  }

}
