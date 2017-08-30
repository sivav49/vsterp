import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/map';

import {ToastsManager} from 'ng2-toastr';

import {InvoiceBos} from './invoice-bos.model';
import {PopupService} from '../../../shared/popup.service';

import {InvoiceService} from '../invoice-service';

@Injectable()
export class InvoiceBosService extends InvoiceService<InvoiceBos> {
  protected apiUrl = 'http://192.168.0.100:4300/api/invoice-bos';

  protected extractData(res: Response): InvoiceBos[] | InvoiceBos {
    const data = super.extractData(res);
    if (Array.isArray(data)) {
      const invoices: InvoiceBos[] = [];
      for (const invoice of data) {
        invoices.push(InvoiceBos.convertFromAny(invoice));
      }
      return invoices;
    } else {
      return InvoiceBos.convertFromAny(data);
    }
  }

  constructor(http: Http,
              toastr: ToastsManager,
              popup: PopupService<InvoiceBos>) {
    super(http, toastr, popup);
  }
}

@Injectable()
export class InvoiceBosGetResolve implements Resolve<InvoiceBos> {

  constructor(private router: Router,
              private invoiceService: InvoiceBosService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): InvoiceBos | Observable<InvoiceBos> | Promise<InvoiceBos> {
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
