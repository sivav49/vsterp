
import {Invoice, InvoiceItem} from '../invoice.model';

export class InvoiceVat extends Invoice {
  public amount: number;
  public vatAmount: number;
  public grandTotal: number;

  constructor(_id: number,
              date: Date,
              public dcNo: number,
              public clientName: string,
              public clientAddress: string,
              public clientTIN: string,
              public description: string,
              public items: InvoiceVatItem[],
              public vatPercent: number) {
    super(_id, date);
  }
}

export class InvoiceVatItem extends InvoiceItem {
  public amount: number;

  constructor(public no: number,
              public description: string,
              public quantity: number,
              public unitPrice: number) {
    super(no, description, quantity, unitPrice);
  }
}
