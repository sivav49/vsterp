export class Invoice {
  constructor(public _id: number,
              public date: Date) {
  }

  getBillNumberText() {
    const size = 4;
    const s = '00000000' + this._id;
    return s.substr(s.length - size);
  }
}

export class InvoiceItem {
  constructor(public no: number,
              public description: string,
              public quantity: number,
              public unitPrice: number) {
  }
}
