export class Client {

  public static convertFromAny(obj): Client {
    let client: Client = undefined;
    if (obj) {
      client = new Client(
        obj._id,
        obj.name,
        obj._id,
        obj.addrl1,
        obj.addrl2,
        obj.state,
        obj.city,
        obj.pincode,
        obj.tin,
        obj.gstin,
        obj.email,
        obj.phone
      );
    }
    return client;
  }

  constructor(public _id: string,
              public name: string,
              public nickName: string,
              public addrl1: string,
              public addrl2: string,
              public state: string,
              public city: string,
              public pincode: string,
              public tin: string,
              public gstin: string,
              public email: string,
              public phone: string) {
  }

  public getAddress() {
    let address = '';
    address += this.addrl1 ? this.addrl1 + ',\n' : '';
    address += this.addrl2 ? this.addrl2 + ',\n' : '';
    address += this.city + ' - ' + this.pincode;
    return address;
  }


}
