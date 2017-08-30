import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/map';

import {ToastsManager} from 'ng2-toastr';

import {InvoiceVat} from './invoice-vat.model';
import {PopupService} from '../../../shared/popup.service';

import {InvoiceService} from '../invoice-service';

@Injectable()
export class InvoiceVatService extends InvoiceService<InvoiceVat> {
  protected apiUrl = 'http://192.168.0.100:4300/api/invoices';

  constructor(http: Http,
              toastr: ToastsManager,
              popup: PopupService<InvoiceVat>) {
    super(http, toastr, popup);
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
