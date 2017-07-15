import {ActivatedRoute, Router} from '@angular/router';
import {Invoice} from './invoice.model';
import {InvoiceService} from './invoice-service';
import {OnInit} from '@angular/core';

export class InvoiceList<T extends Invoice> implements OnInit {

  public loaded = false;
  public invoiceList: T[];
  private errorMessage: any;

  constructor(private invoiceService: InvoiceService<T>,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.reload();
  }

  viewDetails() {
    this.router.navigate([this.invoiceService.active._id], {relativeTo: this.activatedRoute});
  }

  setActive(invoice) {
    this.invoiceService.active = invoice;
  }

  navigateCreate() {
    this.router.navigate(['create'], {relativeTo: this.activatedRoute});
  }

  removeInvoice() {
    this.invoiceService.removeConfirmation(this.invoiceService.active._id)
      .subscribe(() => {
        this.reload();
      });
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
