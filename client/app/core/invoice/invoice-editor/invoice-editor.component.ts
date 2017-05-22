import {Component, OnInit} from '@angular/core';
import {Invoice} from '../invoice.model';
import {InvoiceService} from '../invoice.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, FormArray} from '@angular/forms';

@Component({
  selector: 'app-invoice-editor',
  templateUrl: './invoice-editor.component.html',
  styleUrls: ['./invoice-editor.component.scss']
})
export class InvoiceEditorComponent implements OnInit {
  invoice: Invoice;
  invoiceForm: FormGroup;
  private invoiceAmount: number;
  private invoiceVATAmount: number;
  private invoiceGrandTotal: number;

  constructor(private invoiceService: InvoiceService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    this.activatedRoute.params
      .subscribe(
        (params) => {
          this.invoice = this.invoiceService.getInvoice(params['id']);
          this.setInvoiceForm(this.invoice);
        }
      );
  }

  onSubmit() {

  }

  private createForm() {
    this.invoiceForm = this.fb.group({
      no: '',
      dcNo: '',
      date: '',
      clientName: '',
      clientAddress: '',
      clientTIN: '',
      description: '',
      invoiceItems: this.fb.array([]),
      vatAmount: '',
      grandTotal: ''
    });
  }

  get invoiceItems(): FormArray {
    return this.invoiceForm.get('invoiceItems') as FormArray;
  };

  private setInvoiceForm(invoice: Invoice) {
    const invoiceItemFGs = invoice.invoiceItems.map(() => this.fb.group({
      description: '',
      quantity: '',
      unitPrice: '',
    }));
    const invoiceItemFormArray = this.fb.array(invoiceItemFGs);
    this.invoiceForm.setControl('invoiceItems', invoiceItemFormArray);

    this.invoiceForm.setValue({
      no: invoice.no,
      dcNo: invoice.dcNo || '',
      date: invoice.date,
      clientName: invoice.clientName,
      clientAddress: invoice.clientAddress,
      clientTIN: invoice.clientTIN,
      description: invoice.description,
      vatAmount: invoice.vatAmount || 0,
      grandTotal: invoice.grandTotal || 0,
      invoiceItems: invoice.invoiceItems.map(item => {
        return {
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        };
      })
    });
  }

  computeInvoiceItemAmount(i: number): number {
    const invoiceItem = this.invoiceForm.value.invoiceItems[i];
    return invoiceItem.quantity * invoiceItem.unitPrice;
  }

  computeInvoiceAmount(): number {
    let i, amount = 0;
    const length = this.invoiceForm.value.invoiceItems.length;
    for (i = 0; i < length; i++) {
      const invoiceItem = this.invoiceForm.value.invoiceItems[i];
      amount += invoiceItem.quantity * invoiceItem.unitPrice;
    }
    this.invoiceAmount = amount;
    return this.invoiceAmount;
  }

  computeVATAmount(): number {
    this.invoiceVATAmount = this.invoiceAmount * 0.05;
    return this.invoiceVATAmount;
  }

  computeGrandTotal(): number {
    this.invoiceGrandTotal = this.invoiceAmount + this.invoiceVATAmount;
    return this.invoiceGrandTotal;
  }

  onAddInvoiceItem(i: number): void {
    this.invoiceItems.insert(i + 1, this.fb.group({
      description: '',
      quantity: '',
      unitPrice: '',
    }));
  }

  onDuplicateInvoiceItem(i: number): void {
    const invoiceItem = this.invoiceItems.at(i).value;
    this.invoiceItems.insert(i + 1, this.fb.group({
      description: invoiceItem.description,
      quantity: invoiceItem.quantity,
      unitPrice: invoiceItem.unitPrice,
    }));
  }

  onDeleteInvoiceItem(i: number): void {
    this.invoiceItems.removeAt(i);
    if (this.invoiceItems.length === 0) {
      this.onAddInvoiceItem(0);
    }
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
