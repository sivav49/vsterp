import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormArray, Validators} from '@angular/forms';
import * as moment from 'moment';

import {CustomValidators} from '../../../../shared/CustomValidators';

import {InvoiceGst, InvoiceGstItem} from '../invoice-gst.model';
import {InvoiceGstService} from '../invoice-gst.service';
import {EditorMode, InvoiceEditor} from '../../invoice-editor';
import {InvoiceGstPrintComponent} from '../invoice-gst-print/invoice-gst-print.component';
import {ClientService} from '../../../client/client.service';
import {Client} from '../../../client/client.model';


@Component({
  selector: 'app-invoice-gst-editor',
  templateUrl: './invoice-gst-editor.component.html',
  styleUrls: ['./invoice-gst-editor.component.scss']
})
export class InvoiceGstEditorComponent extends InvoiceEditor<InvoiceGst> {
  @ViewChild('previewtax') preview: InvoiceGstPrintComponent;

  protected basePath = '/invoice-gst';

  constructor(invoiceService: InvoiceGstService,
              clientService: ClientService,
              router: Router,
              activatedRoute: ActivatedRoute,
              fb: FormBuilder) {
    super(invoiceService, clientService, router, activatedRoute, fb);
  }

  onSubmit() {
    const invoice = InvoiceGst.convertFromFormGroup(this.invoiceForm);
    super.onSubmit(invoice);
  }

  protected createForm(invoice?: InvoiceGst) {
    if (!invoice) {
      invoice = new InvoiceGst(undefined, new Date(), '', '', '', '', '', '', '', '', '', '', [new InvoiceGstItem(0, '', '', 0, 0, 0, 0, 0)]);
    }
    const invoiceItemFGs = invoice.items.map((item) => this.createItemFormGroup(item));
    const invoiceItemFormArray = this.fb.array(invoiceItemFGs);

    this.invoiceForm = this.fb.group({
      _id: [invoice._id, [Validators.required]],
      date: [moment(invoice.date).format('YYYY-MM-DD'), [Validators.required, CustomValidators.date]],
      recipientClientList: invoice.recipientName,
      recipientName: invoice.recipientName,
      recipientAddress: invoice.recipientAddress,
      recipientState: invoice.recipientState,
      recipientStateCode: invoice.recipientStateCode,
      recipientGSTIN: invoice.recipientGSTIN,
      consigneeClientList: invoice.consigneeName,
      consigneeName: invoice.consigneeName,
      consigneeAddress: invoice.consigneeAddress,
      consigneeState: invoice.consigneeState,
      consigneeStateCode: invoice.consigneeStateCode,
      consigneeGSTIN: invoice.consigneeGSTIN,
      items: invoiceItemFormArray,
      amount: invoice.amount,
      totalGSTValue: invoice.totalGSTValue,
      grandTotal: invoice.grandTotal,
    });
    if (this.mode === EditorMode.Create || this.mode === EditorMode.Edit) {
      this.invoiceForm.get('recipientClientList').valueChanges.subscribe(
        (name) => {
          const client = this.clientList.find(obj => obj.name === name) as Client;
          if (client) {
            this.invoiceForm.patchValue({
              recipientName: client.name,
              recipientAddress: client.getAddress(),
              recipientState: client.state,
              recipientStateCode: '33',
              recipientGSTIN: client.gstin,
            });
          }
        }
      );
      this.invoiceForm.get('consigneeClientList').valueChanges.subscribe(
        (name) => {
          const client = this.clientList.find(obj => obj.name === name) as Client;
          if (client) {
            this.invoiceForm.patchValue({
              consigneeName: client.name,
              consigneeAddress: client.getAddress(),
              consigneeState: client.state,
              consigneeStateCode: '33',
              consigneeGSTIN: client.gstin,
            });
          }
        }
      );
    } else if (this.mode === EditorMode.View) {
      this.invoiceForm.disable();
    }
  }

  protected createItemFormGroup(item?: InvoiceGstItem) {
    item = item || new InvoiceGstItem(0, '', '', 0, 0, 0, 0, 0);
    const itemFG = this.fb.group({
      description: item.description,
      hsn: item.hsn,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      amount: item.amount,
      cgst: item.cgst,
      sgst: item.sgst,
      igst: item.igst,
      itemTax: item.itemTax
    });

    const fields = ['quantity', 'unitPrice', 'cgst', 'sgst', 'igst'];
    for (const field of fields) {
      itemFG.get(field).valueChanges.subscribe(
        () => {
          this.updateComputedValues();
        }
      );
    }

    return itemFG;
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
