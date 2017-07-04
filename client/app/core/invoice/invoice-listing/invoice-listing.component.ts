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
  public loaded = false;
  public invoiceList: Invoice[];
  private errorMessage: any;

  constructor(private invoiceService: InvoiceService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.reload();
  }

  viewDetails(invoice) {
    this.router.navigate([invoice._id, 'edit'], {relativeTo: this.activatedRoute});
  }

  setActive(invoice) {
    this.invoiceService.active = invoice;
  }

  navigateCreate() {
    this.router.navigate(['create'], {relativeTo: this.activatedRoute});
  }

  private reload() {
    this.loaded = false;
    this.invoiceService.getAll()
      .subscribe(
        (invoices) => {
          this.invoiceList = invoices;
          if (!this.invoiceService.active || this.invoiceList.findIndex(x => x._id === this.invoiceService.active._id) === -1) {
            this.invoiceService.active = this.invoiceList[0];
          }
          this.loaded = true;
        },
        error => this.errorMessage = <any>error
      );
  }
}
