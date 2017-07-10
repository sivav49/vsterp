import {Invoice, InvoiceItem} from '../invoice.model';
import {FormArray, FormGroup} from '@angular/forms';
import * as moment from 'moment';

export class InvoiceGst extends Invoice {
  public amount = 0;
  public totalCGSTValue = 0;
  public totalSGSTValue = 0;
  public totalIGSTValue = 0;
  public totalGSTValue = 0;
  public grandTotal = 0;

  public static convertFromAny(obj): InvoiceGst {
    let invoice: InvoiceGst = undefined;
    if (obj) {
      const invoiceItem: InvoiceGstItem[] = [];
      let index = 0;
      for (const item of obj.items) {
        invoiceItem.push(InvoiceGstItem.convertFromAny(item, index++));
      }
      invoice = new InvoiceGst(
        obj._id,
        new Date(obj.date),
        obj.recipientName,
        obj.recipientAddress,
        obj.recipientState,
        obj.recipientStateCode,
        obj.recipientGSTIN,
        obj.consigneeName,
        obj.consigneeAddress,
        obj.consigneeState,
        obj.consigneeStateCode,
        obj.consigneeGSTIN,
        invoiceItem
      );
    }
    return invoice;
  }

  public static convertFromFormGroup(obj: FormGroup): InvoiceGst {
    let invoice: InvoiceGst = undefined;
    if (obj) {
      const invoiceItem: InvoiceGstItem[] = [];
      const itemFGs = obj.get('items') as FormArray;
      let index = 0;
      for (const item of itemFGs.controls) {
        invoiceItem.push(InvoiceGstItem.convertFromFormGroup(item, index++));
      }
      invoice = new InvoiceGst(
        obj.get('_id').value,
        moment.utc(moment(obj.get('date').value).format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate(),
        obj.get('recipientName').value,
        obj.get('recipientAddress').value,
        obj.get('recipientState').value,
        obj.get('recipientStateCode').value,
        obj.get('recipientGSTIN').value,
        obj.get('consigneeName').value,
        obj.get('consigneeAddress').value,
        obj.get('consigneeState').value,
        obj.get('consigneeStateCode').value,
        obj.get('consigneeGSTIN').value,
        invoiceItem
      );
    }
    return invoice;
  }

  constructor(_id: number,
              date: Date,
              public recipientName: string,
              public recipientAddress: string,
              public recipientState: string,
              public recipientStateCode: string,
              public recipientGSTIN: string,
              public consigneeName: string,
              public consigneeAddress: string,
              public consigneeState: string,
              public consigneeStateCode: string,
              public consigneeGSTIN: string,
              public items: InvoiceGstItem[]) {
    super(_id, date);
    this.updateComputedValues();
  }

  private updateComputedValues(): void {
    let amount = 0, totalCGST = 0, totalSGST = 0, totalIGST = 0;
    for (const item of this.items) {
      amount += item.amount;
      totalCGST += item.cgstValue;
      totalSGST += item.sgstValue;
      totalIGST += item.igstValue;
    }
    this.amount = Math.round(amount);
    this.totalCGSTValue = Math.round(totalCGST);
    this.totalSGSTValue = Math.round(totalSGST);
    this.totalIGSTValue = Math.round(totalIGST);
    this.totalGSTValue = this.totalCGSTValue + this.totalSGSTValue + this.totalIGSTValue;
    this.grandTotal = this.amount + this.totalGSTValue;
  }
}

export class InvoiceGstItem extends InvoiceItem {
  public amount = 0;
  public cgstValue = 0;
  public sgstValue = 0;
  public igstValue = 0;
  public itemTax = 0;

  public static convertFromAny(item, index): InvoiceGstItem {
    return new InvoiceGstItem(
      index,
      item.description,
      item.hsn,
      item.quantity,
      item.unitPrice,
      item.cgst,
      item.sgst,
      item.igst
    );
  }

  public static convertFromFormGroup(item, index): InvoiceGstItem {
    return new InvoiceGstItem(
      index,
      item.get('description').value,
      item.get('hsn').value,
      +item.get('quantity').value,
      +item.get('unitPrice').value,
      +item.get('cgst').value,
      +item.get('sgst').value,
      +item.get('igst').value
    );
  }

  constructor(no: number,
              description: string,
              public hsn: string,
              quantity: number,
              unitPrice: number,
              public cgst: number,
              public sgst: number,
              public igst: number) {
    super(no, description, quantity, unitPrice);
    this.updateComputedValues();
  }

  private updateComputedValues() {
    this.amount = this.quantity * this.unitPrice;
    this.cgstValue = this.amount * this.cgst / 100;
    this.sgstValue = this.amount * this.sgst / 100;
    this.igstValue = this.amount * this.igst / 100;
    this.itemTax = this.cgstValue + this.sgstValue + this.igstValue;
  }
}
