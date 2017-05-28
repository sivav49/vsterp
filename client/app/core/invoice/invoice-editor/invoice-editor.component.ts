import {Component, OnInit} from '@angular/core';
import {Invoice} from '../invoice.model';
import {InvoiceService} from '../invoice.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, FormArray, Validators, AbstractControl} from '@angular/forms';
import {CustomValidators} from '../../../shared/CustomValidators';
import * as moment from 'moment';
import {DecimalPipe} from '@angular/common';
import {LOCALE_ID} from '@angular/core';

@Component({
  selector: 'app-invoice-editor',
  templateUrl: './invoice-editor.component.html',
  styleUrls: ['./invoice-editor.component.scss'],
  providers: [DecimalPipe,
    {provide: LOCALE_ID, useValue: 'en-IN'}]
})
export class InvoiceEditorComponent implements OnInit {
  public invoiceNo = '';
  public invoice: Invoice;
  public invoiceForm: FormGroup;
  private errorMessage: any;

  constructor(private invoiceService: InvoiceService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private decimalPipe: DecimalPipe) {
    this.createForm();
  }

  ngOnInit() {
    this.activatedRoute.params
      .subscribe(
        (params) => {
          this.invoiceService.getInvoice(params['id'])
            .subscribe(
              invoice => {
                this.invoice = invoice;
                this.invoiceNo = this.invoice.no.toFixed(0);
                this.setInvoiceForm(this.invoice);
              },
              error => {
                if (error.status === 404) {
                  this.router.navigate(['404']);
                }
              }
            );
        }
      );
  }

  onSubmit() {
    console.log('submit isFormValid' + this.invoiceForm.status);
  }

  private createForm() {
    this.invoiceForm = this.fb.group({
      no: ['', [Validators.required]],
      dcNo: '',
      date: ['', [Validators.required, CustomValidators.date]],
      clientName: '',
      clientAddress: '',
      clientTIN: '',
      description: '',
      invoiceItems: this.fb.array([]),
      amount: '',
      vatAmount: '',
      grandTotal: ''
    });
    this.invoiceForm.get('no').disable();
    this.invoiceForm.get('amount').disable();
    this.invoiceForm.get('vatAmount').disable();
    this.invoiceForm.get('grandTotal').disable();
  }

  get invoiceItems(): FormArray {
    return this.invoiceForm.get('invoiceItems') as FormArray;
  };

  formatNumber(number: Number) {
    return this.decimalPipe.transform(number, '1.2-2');
  }

  private updateAllAmount() {
    const itemFGs = this.invoiceForm.get('invoiceItems') as FormArray;
    for (const item of itemFGs.controls) {
      this.updateItemAmount(item);
    }
    this.updateInvoiceAmount();
  }

  private updateItemAmount(itemFormGroup: AbstractControl) {
    const quantity = itemFormGroup.get('quantity').value;
    const unitPrice = itemFormGroup.get('unitPrice').value;
    const itemAmount = quantity * unitPrice;
    itemFormGroup.get('itemAmount').setValue(this.formatNumber(itemAmount));
  }

  private updateInvoiceAmount() {
    const itemFGs = this.invoiceForm.get('invoiceItems') as FormArray;
    let amount = 0;
    for (const item of itemFGs.controls) {
      const qty = item.get('quantity').value;
      const rate = item.get('unitPrice').value;
      amount += qty * rate;
    }
    const vatAmount = amount * 0.05;
    const grandTotal = amount + vatAmount;
    this.invoiceForm.get('amount').setValue(this.formatNumber(amount));
    this.invoiceForm.get('vatAmount').setValue(this.formatNumber(vatAmount));
    this.invoiceForm.get('grandTotal').setValue(this.formatNumber(grandTotal));
  }

  private createItemFormGroup(item?) {
    item = item || {};
    const itemFG = this.fb.group({
      description: item.description || '',
      quantity: item.quantity || '',
      unitPrice: item.unitPrice || '',
      itemAmount: 0
    });
    this.updateItemAmount(itemFG);
    itemFG.get('quantity').valueChanges.subscribe(
      () => {
        this.updateItemAmount(itemFG);
        this.updateInvoiceAmount();
      }
    );
    itemFG.get('unitPrice').valueChanges.subscribe(
      () => {
        this.updateItemAmount(itemFG);
        this.updateInvoiceAmount();
      }
    );
    itemFG.get('itemAmount').disable();
    return itemFG;
  }

  private setInvoiceForm(invoice: Invoice) {
    const invoiceItemFGs = invoice.items.map(() => this.createItemFormGroup());
    const invoiceItemFormArray = this.fb.array(invoiceItemFGs);
    this.invoiceForm.setControl('invoiceItems', invoiceItemFormArray);

    this.invoiceForm.setValue({
      no: invoice.no,
      dcNo: invoice.dcNo || '',
      date: moment(invoice.date).format('DD-MM-YYYY'),
      clientName: invoice.clientName,
      clientAddress: invoice.clientAddress || '',
      clientTIN: invoice.clientTIN || '',
      description: invoice.description || '',
      invoiceItems: invoice.items.map(item => {
        return {
          description: item.description || '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          itemAmount: 0
        };
      }),
      amount: 0,
      vatAmount: 0,
      grandTotal: 0
    });
    this.updateAllAmount();
  }

  onAddInvoiceItem(i: number): void {
    this.invoiceItems.insert(i + 1, this.createItemFormGroup());
  }

  onDuplicateInvoiceItem(i: number): void {
    const item = this.invoiceItems.at(i).value;
    this.invoiceItems.insert(i + 1, this.createItemFormGroup(item));
    this.updateInvoiceAmount();
  }

  onDeleteInvoiceItem(i: number): void {
    this.invoiceItems.removeAt(i);
    if (this.invoiceItems.length === 0) {
      this.onAddInvoiceItem(0);
    }
    this.updateInvoiceAmount();
  }

  backToInvoiceList() {
    this.router.navigate(['invoice']);
  }

  nextInvoice() {
    this.navigateToInvoice(this.invoiceService.getActiveInvoice()._id);
  }

  prevInvoice() {
    this.navigateToInvoice(this.invoiceService.getActiveInvoice()._id);
  }

  private navigateToInvoice(id: number): void {
    this.router.navigate(['..', id], {relativeTo: this.activatedRoute});
  }
}
