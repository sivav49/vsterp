export class Invoice {
  constructor(public _id: number,
              public date: Date) {
  }
}

export class InvoiceItem {

  constructor(public no: number,
              public description: string,
              public quantity: number,
              public unitPrice: number) {
  }
}
