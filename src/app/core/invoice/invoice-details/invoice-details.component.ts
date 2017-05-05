import {Component, OnInit} from '@angular/core';
import {Invoice} from '../invoice.model';
import {InvoiceItem} from '../invoice-item/invoice-item.model';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {

  invoiceList: Invoice[] = [
    new Invoice(1990, 'VST Associated Graphics', 'No7, Kamarajar Salai, Chennai - 87', '33231380566', [
      new InvoiceItem(1, 'Hindi Varnamala 1\n48Pages, 1000 Copies', 1000, 7),
      new InvoiceItem(2, 'Hindi Varnamala 2\n36Pages, 1000 Copies', 1000, 7),
      new InvoiceItem(3, 'Hindi Writing Book 5\n60Pages, 3000 Copies', 3000, 5)
    ], true),
    new Invoice(1990, 'VST Associated Graphics', 'No7, Kamarajar Salai, Chennai - 87', '33231380566', [
      new InvoiceItem(1, 'Hindi Varnamala 1\n48Pages, 3000 Copies', 3000, 5)
    ], true),
    new Invoice(1990, 'VST Associated Graphics', 'No7, Kamarajar Salai, Chennai - 87', '33231380566', [
      new InvoiceItem(1, 'Hindi Varnamala 1\n48Pages, 3000 Copies', 3000, 5)
    ], true),
    new Invoice(1990, 'VST Associated Graphics', 'No7, Kamarajar Salai, Chennai - 87', '33231380566', [
      new InvoiceItem(1, 'Hindi Varnamala 1\n48Pages, 3000 Copies', 3000, 5)
    ], true)
  ];

  activeInvoice: Invoice = this.invoiceList[0];

  constructor() {
  }

  ngOnInit() {
  }

}
