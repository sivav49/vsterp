import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/map';

import {ToastsManager} from 'ng2-toastr';

import {InvoiceGst} from './invoice-gst.model';
import {PopupService} from '../../../shared/popup.service';

import {InvoiceService} from '../invoice-service';

@Injectable()
export class InvoiceGstService extends InvoiceService<InvoiceGst> {
  protected apiUrl = 'http://192.168.0.100:4300/api/invoice-gst';

  protected extractData(res: Response): InvoiceGst[] | InvoiceGst {
    const data = super.extractData(res);
    if (Array.isArray(data)) {
     const invoices: InvoiceGst[] = [];
     for (const invoice of data) {
       invoices.push(InvoiceGst.convertFromAny(invoice));
     }
     return invoices;
    } else {
      return InvoiceGst.convertFromAny(data);
    }
  }

  constructor(http: Http,
              toastr: ToastsManager,
              popup: PopupService<InvoiceGst>) {
    super(http, toastr, popup);
  }
}

@Injectable()
export class InvoiceGstGetResolve implements Resolve<InvoiceGst> {

  constructor(private router: Router,
              private invoiceService: InvoiceGstService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): InvoiceGst | Observable<InvoiceGst> | Promise<InvoiceGst> {
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
