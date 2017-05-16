import {Component, OnInit} from '@angular/core';
import {InvoiceService} from './invoice.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  providers: [InvoiceService]
})
export class InvoiceComponent implements OnInit {


  constructor() { }

  ngOnInit() {
  }

}
