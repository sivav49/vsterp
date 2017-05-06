export class Invoice {
  constructor(public no: number,
              public dcNo: number,
              public date: Date,
              public clientName: string,
              public clientAddress: string,
              public clientTIN: string,
              public generalDescription: string,
              public isHideQtyRate: boolean,
              public invoiceItem: Array<InvoiceItem>,
              public amount: number,
              public vatPercent: number,
              public vatAmount: number,
              public grandTotal: number) {}
}

export class InvoiceItem {
  constructor(public no: number,
              public description: string,
              public quantity: number,
              public unitPrice: number,
              public amount: number) {}
}
