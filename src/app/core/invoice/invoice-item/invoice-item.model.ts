export class InvoiceItem {
  public no: number;
  public description: string;
  public quantity: number;
  public unitPrice: number;
  private amount: number;

  constructor(no: number, description: string, quantity: number, unitPrice: number) {
    this.no = no;
    this.description = description;
    this.quantity = quantity;
    this.unitPrice = unitPrice;

    this.amount = this.quantity * this.unitPrice;
  }

  getAmount() {
    return this.amount;
  }
}
