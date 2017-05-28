import {Component, OnInit} from '@angular/core';
import {InvoiceService} from '../invoice.service';
import {Invoice} from '../invoice.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-invoice-listing',
  templateUrl: './invoice-listing.component.html',
  styleUrls: ['./invoice-listing.component.scss']
})
export class InvoiceListingComponent implements OnInit {
  invoiceList: Invoice[];
  errorMessage: any;

  constructor(private invoiceService: InvoiceService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.invoiceService.getInvoiceList()
      .subscribe(
        invoices => this.invoiceList = invoices,
        error => this.errorMessage = <any>error
      );
  }

  getActiveInvoice() {
    return this.invoiceService.getActiveInvoice();
  }

  setActiveInvoice(invoice) {
    this.invoiceService.setActiveInvoice(invoice);
  }

  viewDetails() {
    this.router.navigate([this.invoiceService.getActiveInvoice().no], {relativeTo: this.activatedRoute});
  }
}
