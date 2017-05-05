import {Component, OnInit} from '@angular/core';
import {Invoice} from './invoice.model';
import {InvoiceItem} from './invoice-item/invoice-item.model';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  invoiceList: Invoice[] = [
    new Invoice(1990, 'VST Associated Graphics', 'No7, Kamarajar Salai, Chennai - 87', '33231380566', [
      new InvoiceItem(1, 'Hindi Varnamala 1\n48Pages, 3000 Copies', 3000, 5)
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

  constructor() {
  }

  ngOnInit() {
  }

}
