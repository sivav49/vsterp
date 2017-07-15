import {Component} from '@angular/core';
import {InvoiceGstService} from '../invoice-gst.service';
import {InvoiceGst} from '../invoice-gst.model';
import {ActivatedRoute, Router} from '@angular/router';
import {InvoiceList} from '../../invoice-list';

@Component({
  selector: 'app-invoice-gst-list',
  templateUrl: './invoice-gst-list.component.html',
  styleUrls: ['./invoice-gst-list.component.scss']
})
export class InvoiceGstListComponent extends InvoiceList<InvoiceGst> {

  constructor(invoiceService: InvoiceGstService,
              router: Router,
              activatedRoute: ActivatedRoute) {
    super(invoiceService, router, activatedRoute);
  }
}
