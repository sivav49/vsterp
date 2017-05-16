import {Component, OnInit} from '@angular/core';
import {Invoice} from '../invoice.model';
import {InvoiceService} from '../invoice.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-invoice-editor',
  templateUrl: './invoice-editor.component.html',
  styleUrls: ['./invoice-editor.component.scss']
})
export class InvoiceEditorComponent implements OnInit {
  isReadonly = false;
  invoice: Invoice;

  constructor(private invoiceService: InvoiceService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.activatedRoute.params
      .subscribe(
        (params) => {
          this.invoice = this.invoiceService.getInvoice(params['id']);
        }
      );
  }

  backToInvoiceList() {
    this.router.navigate(['invoice']);
  }

  nextInvoice() {
    this.invoiceService.activateNextInvoice();
    this.navigateToInvoice(this.invoiceService.getActiveInvoice()._id);
  }

  prevInvoice() {
    this.invoiceService.activatePrevInvoice();
    this.navigateToInvoice(this.invoiceService.getActiveInvoice()._id);
  }

  private navigateToInvoice(id: number): void {
    this.router.navigate(['..', id], {relativeTo: this.activatedRoute});
  }
}
