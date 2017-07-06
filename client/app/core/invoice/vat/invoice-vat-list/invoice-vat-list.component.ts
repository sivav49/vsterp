import {Component, OnInit} from '@angular/core';
import {InvoiceVatService} from '../invoice-vat.service';
import {InvoiceVat} from '../invoice-vat.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-invoice-vat-list',
  templateUrl: './invoice-vat-list.component.html',
  styleUrls: ['./invoice-vat-list.component.scss']
})
export class InvoiceVatListComponent implements OnInit {
  public loaded = false;
  public invoiceList: InvoiceVat[];
  private errorMessage: any;

  constructor(private invoiceService: InvoiceVatService,
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
