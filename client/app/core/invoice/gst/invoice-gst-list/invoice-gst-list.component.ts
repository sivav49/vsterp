import {Component, OnInit} from '@angular/core';
import {InvoiceGstService} from '../invoice-gst.service';
import {InvoiceGst} from '../invoice-gst.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-invoice-gst-list',
  templateUrl: './invoice-gst-list.component.html',
  styleUrls: ['./invoice-gst-list.component.scss']
})
export class InvoiceGstListComponent implements OnInit {
  public loaded = false;
  public invoiceList: InvoiceGst[];
  private errorMessage: any;

  constructor(private invoiceService: InvoiceGstService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.reload();
  }

  viewDetails(invoice) {
    this.router.navigate([invoice._id], {relativeTo: this.activatedRoute});
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
