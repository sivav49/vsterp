import { Component } from '@angular/core';
import {InvoiceList} from '../../invoice-list';
import {InvoiceBos} from '../invoice-bos.model';
import {InvoiceBosService} from '../invoice-bos.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-invoice-bos-list',
  templateUrl: './invoice-bos-list.component.html',
  styleUrls: ['./invoice-bos-list.component.scss']
})
export class InvoiceBosListComponent extends InvoiceList<InvoiceBos> {

  constructor(invoiceService: InvoiceBosService,
              router: Router,
              activatedRoute: ActivatedRoute) {
    super(invoiceService, router, activatedRoute);
  }

}
