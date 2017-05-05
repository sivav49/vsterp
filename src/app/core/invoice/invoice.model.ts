import {InvoiceItem} from './invoice-item/invoice-item.model';

export class Invoice {
  public no: number;
  public date: Date;
  public clientName: string;
  public clientAddress: string;
  public clientTIN: string;
  public invoiceItem: Array<InvoiceItem>;
  public isVAT: boolean;

  private amount: number;
  private vatAmount: number;
  private grandTotal: number;

  constructor(no: number, name: string, address: string, tin: string, invoiceItem: Array<InvoiceItem>, isVAT: boolean) {
    this.no = no;
    this.date = new Date();
    this.clientName = name;
    this.clientAddress = address;
    this.clientTIN = tin;
    this.invoiceItem = invoiceItem;
    this.isVAT = isVAT;

    this.amount = 0;
    for (const item of this.invoiceItem) {
      this.amount += item.getAmount();
    }

    this.vatAmount = 0;
    if (this.isVAT) {
      this.vatAmount = this.amount * 0.05;
    }

    this.grandTotal = this.amount + this.vatAmount;
  }

  getAmount() {
    return this.amount;
  }

  getVATAmount() {
    return this.vatAmount;
  }

  getGrandTotal() {
    return this.grandTotal;
  }
}
