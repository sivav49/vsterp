import {Invoice, InvoiceItem} from '../invoice.model';

export class InvoiceGst extends Invoice {
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
  }
}

export class InvoiceGstItem extends InvoiceItem {
  constructor(no: number,
              description: string,
              public hsn: string,
              quantity: number,
              unitPrice: number,
              public cgst: number,
              public sgst: number,
              public igst: number) {
    super(no, description, quantity, unitPrice);
  }
}
