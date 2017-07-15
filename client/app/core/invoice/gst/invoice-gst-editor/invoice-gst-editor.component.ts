import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormArray, Validators} from '@angular/forms';
import * as moment from 'moment';

import {CustomValidators} from '../../../../shared/CustomValidators';

import {InvoiceGst} from '../invoice-gst.model';
import {InvoiceGstService} from '../invoice-gst.service';
import {InvoiceGstPrintComponent} from '../invoice-gst-print/invoice-gst-print.component';
import {EditorMode, InvoiceEditor} from '../../invoice-editor';


@Component({
  selector: 'app-invoice-gst-editor',
  templateUrl: './invoice-gst-editor.component.html',
  styleUrls: ['./invoice-gst-editor.component.scss']
})
export class InvoiceGstEditorComponent extends InvoiceEditor<InvoiceGst> {
  @ViewChild('previewtax') preview: InvoiceGstPrintComponent;

  constructor(invoiceService: InvoiceGstService,
              router: Router,
              activatedRoute: ActivatedRoute,
              fb: FormBuilder) {
    super(invoiceService, router, activatedRoute, fb);
  }

  onSubmit() {
    const invoice = InvoiceGst.convertFromFormGroup(this.invoiceForm);
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
      amount: 0,
      totalGSTValue: 0,
      grandTotal: 0,
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
      amount: 0,
      cgst: item.cgst || 0,
      sgst: item.sgst || 0,
      igst: item.igst || 0,
      itemTax: 0
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
    itemFG.get('cgst').valueChanges.subscribe(
      () => {
        this.updateComputedValues();
      }
    );
    itemFG.get('sgst').valueChanges.subscribe(
      () => {
        this.updateComputedValues();
      }
    );
    itemFG.get('igst').valueChanges.subscribe(
      () => {
        this.updateComputedValues();
      }
    );

    return itemFG;
  }

  protected setInvoiceForm(invoice: InvoiceGst) {
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
    const invoice = InvoiceGst.convertFromFormGroup(this.invoiceForm);

    const itemFGs = this.invoiceForm.get('items') as FormArray;
    itemFGs.controls.forEach((item, index) => {
      const invItem = invoice.items[index];
      if (invItem) {
        item.get('amount').setValue(invItem.amount);
        item.get('itemTax').setValue(invItem.itemTax);
      }
    });

    this.invoiceForm.get('amount').setValue(invoice.amount);
    this.invoiceForm.get('totalGSTValue').setValue(invoice.totalGSTValue);
    this.invoiceForm.get('grandTotal').setValue(invoice.grandTotal);
  }

  onPrint() {
    if (this.preview) {
      this.preview.print();
    }
  }
}
