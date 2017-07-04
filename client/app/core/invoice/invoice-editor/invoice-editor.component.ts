import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, FormArray, Validators, AbstractControl} from '@angular/forms';
import {Location, DecimalPipe} from '@angular/common';
import {LOCALE_ID} from '@angular/core';
import * as moment from 'moment';

import {CustomValidators} from '../../../shared/CustomValidators';

import {Invoice} from '../invoice.model';
import {InvoiceService} from '../invoice.service';
import {Observable} from 'rxjs/Observable';
import {InvoicePreviewTaxComponent} from '../invoice-preview-tax/invoice-preview-tax.component';

enum EditorMode {
  None,
  Create,
  View,
  Edit
}

const defaultVAT = 5;

@Component({
  selector: 'app-invoice-editor',
  templateUrl: './invoice-editor.component.html',
  styleUrls: ['./invoice-editor.component.scss'],
  providers: [DecimalPipe,
    {provide: LOCALE_ID, useValue: 'en-IN'}]
})
export class InvoiceEditorComponent implements OnInit {
  // @ViewChild('previewvat') preview: InvoicePreviewComponent;
  @ViewChild('previewtax') preview: InvoicePreviewTaxComponent;

  private mode = EditorMode.None;

  public invoiceForm: FormGroup;
  private errorMessage: any;

  constructor(public invoiceService: InvoiceService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private decimalPipe: DecimalPipe) {
    this.createForm();
  }

  ngOnInit() {
    this.activatedRoute.data
      .subscribe(
        data => {
          this.mode = data.mode;
          if (this.mode === EditorMode.Edit || this.mode === EditorMode.View) {
            this.setInvoiceForm(data.invoice);
            this.invoiceService.active = data.invoice;
          }
        }
      );
  }

  onSubmit() {
    let serviceCall: Observable<Invoice>;
    const invoice = this.invoiceForm.value;
    invoice.vatPercent = invoice.isVAT ? defaultVAT : 0;
    if (this.mode === EditorMode.Create) {
      serviceCall = this.invoiceService.create(invoice);

    } else if (this.mode === EditorMode.Edit) {
      serviceCall = this.invoiceService.update(this.invoiceService.active._id, invoice);
    }
    serviceCall.subscribe(
      (data) => {
        this.invoiceForm.reset();
        this.setInvoiceForm(data);
      }
    );
  }

  onPrint() {
    if (this.preview) {
      this.preview.print(this.invoiceForm.value);
    }
  }

  private createForm() {
    this.invoiceForm = this.fb.group({
      _id: ['', [Validators.required]],
      dcNo: '',
      date: ['', [Validators.required, CustomValidators.date]],
      clientName: '',
      clientAddress: '',
      clientTIN: '',
      description: '',
      items: this.fb.array([]),
      isVAT: true,
      amount: '',
      vatAmount: '',
      grandTotal: ''
    });
    // this.invoiceForm.get('_id').disable();
    // this.invoiceForm.get('amount').disable();
    // this.invoiceForm.get('vatAmount').disable();
    // this.invoiceForm.get('grandTotal').disable();
    this.onAddInvoiceItem(0);
    this.invoiceForm.get('isVAT').valueChanges.subscribe(
      () => {
        this.updateInvoiceAmount();
      }
    );
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  };

  onAddInvoiceItem(i: number): void {
    this.items.insert(i + 1, this.createItemFormGroup());
  }

  onDuplicateInvoiceItem(i: number): void {
    const item = this.items.at(i).value;
    this.items.insert(i + 1, this.createItemFormGroup(item));
    this.updateInvoiceAmount();
  }

  onDeleteInvoiceItem(i: number): void {
    this.items.removeAt(i);
    if (this.items.length === 0) {
      this.onAddInvoiceItem(0);
    }
    this.updateInvoiceAmount();
  }

  navigateList() {
    this.router.navigate(['invoices']);
  }

  nextInvoice() {
    this.navigateToInvoice(this.invoiceService.active._id + 1);
  }

  previousInvoice() {
    this.navigateToInvoice(this.invoiceService.active._id - 1);
  }

  private navigateToInvoice(id: number): void {
    if (this.invoiceForm.dirty) {
      alert('unsaved changes');
    } else {
      this.router.navigate(['../..', id], {relativeTo: this.activatedRoute});
    }
  }

  private updateAllAmount() {
    const itemFGs = this.invoiceForm.get('items') as FormArray;
    for (const item of itemFGs.controls) {
      this.updateItemAmount(item);
    }
    this.updateInvoiceAmount();
  }

  private updateItemAmount(itemFormGroup: AbstractControl) {
    const quantity = itemFormGroup.get('quantity').value;
    const unitPrice = itemFormGroup.get('unitPrice').value;
    const itemAmount = quantity * unitPrice;
    // itemFormGroup.get('amount').setValue(this.formatNumber(itemAmount));
    itemFormGroup.get('amount').setValue(itemAmount);
  }

  private updateInvoiceAmount() {
    const itemFGs = this.invoiceForm.get('items') as FormArray;
    let amount = 0;
    for (const item of itemFGs.controls) {
      const qty = item.get('quantity').value;
      const rate = item.get('unitPrice').value;
      amount += qty * rate;
    }
    const isVAT = this.invoiceForm.get('isVAT').value;
    const vatAmount = amount * (isVAT ? defaultVAT / 100 : 0);
    const grandTotal = amount + vatAmount;
    this.invoiceForm.get('amount').setValue(amount);
    this.invoiceForm.get('vatAmount').setValue(vatAmount);
    this.invoiceForm.get('grandTotal').setValue(grandTotal);
  }

  private createItemFormGroup(item?) {
    item = item || {};
    const itemFG = this.fb.group({
      description: item.description || '',
      quantity: item.quantity || '',
      unitPrice: item.unitPrice || '',
      amount: 0
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
    // itemFG.get('amount').disable();
    return itemFG;
  }

  private setInvoiceForm(invoice: Invoice) {
    const invoiceItemFGs = invoice.items.map(() => this.createItemFormGroup());
    const invoiceItemFormArray = this.fb.array(invoiceItemFGs);
    this.invoiceForm.setControl('items', invoiceItemFormArray);

    this.invoiceForm.setValue({
      _id: invoice._id,
      dcNo: invoice.dcNo || '',
      date: moment(invoice.date).format('DD-MM-YYYY'),
      clientName: invoice.clientName,
      clientAddress: invoice.clientAddress || '',
      clientTIN: invoice.clientTIN || '',
      description: invoice.description || '',
      items: invoice.items.map(item => {
        return {
          description: item.description || '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: 0
        };
      }),
      isVAT: invoice.vatPercent !== 0,
      amount: 0,
      vatAmount: 0,
      grandTotal: 0
    });

    this.updateAllAmount();
  }
}
