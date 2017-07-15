import {Invoice, InvoiceItem} from '../invoice.model';
import {FormArray, FormGroup} from '@angular/forms';
import * as moment from 'moment';

export class InvoiceBos extends Invoice {
  public amount = 0;

  public static convertFromAny(obj): InvoiceBos {
    let invoice: InvoiceBos = undefined;
    if (obj) {
      const invoiceItem: InvoiceBosItem[] = [];
      let index = 0;
      for (const item of obj.items) {
        invoiceItem.push(InvoiceBosItem.convertFromAny(item, index++));
      }
      invoice = new InvoiceBos(
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

  public static convertFromFormGroup(obj: FormGroup): InvoiceBos {
    let invoice: InvoiceBos = undefined;
    if (obj) {
      const invoiceItem: InvoiceBosItem[] = [];
      const itemFGs = obj.get('items') as FormArray;
      let index = 0;
      for (const item of itemFGs.controls) {
        invoiceItem.push(InvoiceBosItem.convertFromFormGroup(item, index++));
      }
      invoice = new InvoiceBos(
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
              public items: InvoiceBosItem[]) {
    super(_id, date);
    this.updateComputedValues();
  }

  private updateComputedValues(): void {
    let amount = 0;
    for (const item of this.items) {
      amount += item.amount;
    }
    this.amount = Math.round(amount);
  }
}

export class InvoiceBosItem extends InvoiceItem {
  public amount = 0;

  public static convertFromAny(item, index): InvoiceBosItem {
    return new InvoiceBosItem(
      index,
      item.description,
      item.hsn,
      item.quantity,
      item.unitPrice
    );
  }

  public static convertFromFormGroup(item, index): InvoiceBosItem {
    return new InvoiceBosItem(
      index,
      item.get('description').value,
      item.get('hsn').value,
      +item.get('quantity').value,
      +item.get('unitPrice').value
    );
  }

  constructor(no: number,
              description: string,
              public hsn: string,
              quantity: number,
              unitPrice: number) {
    super(no, description, quantity, unitPrice);
    this.updateComputedValues();
  }

  private updateComputedValues() {
    this.amount = this.quantity * this.unitPrice;
  }
}
