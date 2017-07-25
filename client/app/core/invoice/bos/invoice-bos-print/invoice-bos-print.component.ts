import {Component, OnInit} from '@angular/core';
import {InvoiceBos} from '../invoice-bos.model';
import {InvoicePrint} from '../../invoice-print';

@Component({
  selector: 'app-invoice-bos-print',
  templateUrl: './invoice-bos-print.component.html'
})
export class InvoiceBosPrintComponent extends InvoicePrint<InvoiceBos> implements OnInit {

  protected rootId = 'invoice-bos-print';
  protected pageId = 'invoice-bos-page';
  protected billPrefix = 'VST/BS-';

  constructor() {
    super();
  }

  ngOnInit() {
  }
}
