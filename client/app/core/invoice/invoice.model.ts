export class Invoice {
  public amount: number;
  public vatAmount: number;
  public grandTotal: number;
  constructor(
              public _id: number,
              public no: number,
              public dcNo: number,
              public date: Date,
              public clientName: string,
              public clientAddress: string,
              public clientTIN: string,
              public description: string,
              public isHideQtyRate: boolean,
              public invoiceItems: InvoiceItem[],
              public vatPercent: number) {}
}

export class InvoiceItem {
  public amount: number;
  constructor(public no: number,
              public description: string,
              public quantity: number,
              public unitPrice: number) {}
}
