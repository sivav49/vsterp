import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import * as moment from 'moment';

import {CustomValidators} from '../../../../shared/CustomValidators';

import {InvoiceBosService} from '../invoice-bos.service';
import {EditorMode, InvoiceEditor} from '../../invoice-editor';
import {InvoiceBos} from '../invoice-bos.model';
import {InvoiceBosPrintComponent} from '../invoice-bos-print/invoice-bos-print.component';


@Component({
  selector: 'app-invoice-bos-editor',
  templateUrl: './invoice-bos-editor.component.html',
  styleUrls: ['./invoice-bos-editor.component.scss']
})
export class InvoiceBosEditorComponent extends InvoiceEditor<InvoiceBos> {
  @ViewChild('previewtax') preview: InvoiceBosPrintComponent;

  constructor(invoiceService: InvoiceBosService,
              router: Router,
              activatedRoute: ActivatedRoute,
              fb: FormBuilder) {
    super(invoiceService, router, activatedRoute, fb);
  }

  onSubmit() {
    const invoice = InvoiceBos.convertFromFormGroup(this.invoiceForm);
    super.onSubmit(invoice);
  }

  protected createForm() {
    this.invoiceForm = this.fb.group({
      _id: ['', [Validators.required]],
      date: ['', [Validators.required, CustomValidators.date]],
      recipientName: '',
      recipientAddress: '',
      recipientState: '',
      recipientStateCode: '',
      recipientGSTIN: '',
      consigneeName: '',
      consigneeAddress: '',
      consigneeState: '',
      consigneeStateCode: '',
      consigneeGSTIN: '',
      items: this.fb.array([]),
      amount: '',
      grandTotal: '',
    });
    this.onAddInvoiceItem(0);
  }

  protected createItemFormGroup(item?) {
    item = item || {};
    const itemFG = this.fb.group({
      description: item.description || '',
      hsn: item.hsn || '',
      quantity: item.quantity || 0,
      unitPrice: item.unitPrice || 0,
      amount: 0
    });

    itemFG.get('quantity').valueChanges.subscribe(
      () => {
        this.updateComputedValues();
      }
    );
    itemFG.get('unitPrice').valueChanges.subscribe(
      () => {
        this.updateComputedValues();
      }
    );

    return itemFG;
  }

  protected setInvoiceForm(invoice: InvoiceBos) {
    const invoiceItemFGs = invoice.items.map((item) => this.createItemFormGroup(item));
    const invoiceItemFormArray = this.fb.array(invoiceItemFGs);
    this.invoiceForm.setControl('items', invoiceItemFormArray);

    this.invoiceForm.patchValue({
      _id: invoice._id,
      date: moment(invoice.date).format('YYYY-MM-DD'),
      recipientName: invoice.recipientName,
      recipientAddress: invoice.recipientAddress,
      recipientState: invoice.recipientState,
      recipientStateCode: invoice.recipientStateCode,
      recipientGSTIN: invoice.recipientGSTIN,
      consigneeName: invoice.consigneeName,
      consigneeAddress: invoice.consigneeAddress,
      consigneeState: invoice.consigneeState,
      consigneeStateCode: invoice.consigneeStateCode,
      consigneeGSTIN: invoice.consigneeGSTIN,
      amount: 0,
      totalGSTValue: 0,
      grandTotal: 0
    });

    this.updateComputedValues();
    if (this.mode === EditorMode.View) {
      this.invoiceForm.disable();
    }
  }

  protected updateComputedValues() {
    const invoice = InvoiceBos.convertFromFormGroup(this.invoiceForm);

    const itemFGs = this.invoiceForm.get('items') as FormArray;
    itemFGs.controls.forEach((item, index) => {
      const invItem = invoice.items[index];
      if (invItem) {
        item.get('amount').setValue(invItem.amount);
      }
    });

    this.invoiceForm.get('amount').setValue(invoice.amount);
  }

  onPrint() {
    if (this.preview) {
      this.preview.print();
    }
  }
}
