import {Component, OnInit} from '@angular/core';
import {Invoice} from './invoice.model';
import invoiceDummyData from './invoiceDummyList';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  invoiceList: Invoice[] = invoiceDummyData;

  activeInvoice: Invoice = this.invoiceList[0];

  setActiveInvoice(invoice) {
    this.activeInvoice = invoice;
  }

  constructor() {
  }

  ngOnInit() {
  }

}
