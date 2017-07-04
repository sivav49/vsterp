export class InvoiceVat {
  public amount: number;
  public vatAmount: number;
  public grandTotal: number;

  constructor(public _id: number,
              public dcNo: number,
              public date: Date,
              public clientName: string,
              public clientAddress: string,
              public clientTIN: string,
              public description: string,
              public items: InvoiceVatItem[],
              public vatPercent: number) {
  }
}

export class InvoiceVatItem {
  public amount: number;

  constructor(public no: number,
              public description: string,
              public quantity: number,
              public unitPrice: number) {
  }
}
