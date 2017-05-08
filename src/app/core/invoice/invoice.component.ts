import {Component, OnInit} from '@angular/core';
import {Invoice} from './invoice.model';
import {InvoiceService} from './invoice.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  invoiceList: Invoice[];
  activeInvoice: Invoice;

  constructor(private invoiceService: InvoiceService) {
    this.invoiceList = this.invoiceService.getInvoiceList();
    this.activeInvoice = this.invoiceService.getInvoice(0);
  }

  ngOnInit() {
  }

  setActiveInvoice(invoice) {
    this.activeInvoice = invoice;
  }
}
