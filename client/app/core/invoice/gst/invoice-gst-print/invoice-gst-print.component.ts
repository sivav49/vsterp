import {Component, OnInit} from '@angular/core';
import {InvoiceGst} from '../invoice-gst.model';
import {InvoicePrint} from '../../invoice-print';

@Component({
  selector: 'app-invoice-gst-print',
  templateUrl: './invoice-gst-print.component.html'
})
export class InvoiceGstPrintComponent extends InvoicePrint<InvoiceGst> implements OnInit {

  protected rootId = 'invoice-gst-print';
  protected pageId = 'invoice-gst-page';
  protected billPrefix = 'VST/TI-';

  constructor() {
    super();
  }

  ngOnInit() {
  }
}
