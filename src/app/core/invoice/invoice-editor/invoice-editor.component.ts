import {Component, OnInit} from '@angular/core';
import {Invoice} from '../invoice.model';
import {InvoiceService} from '../invoice.service';

@Component({
  selector: 'app-invoice-editor',
  templateUrl: './invoice-editor.component.html',
  styleUrls: ['./invoice-editor.component.scss']
})
export class InvoiceEditorComponent implements OnInit {
  isReadonly = true;
  invoice: Invoice;

  constructor(private invoiceService: InvoiceService) {
    this.invoice = this.invoiceService.getInvoice(0);
  }

  ngOnInit() {
  }

}
