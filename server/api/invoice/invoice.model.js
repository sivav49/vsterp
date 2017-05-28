let mongoose = require('mongoose');
let mongooseUniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let invoiceSchema = new Schema({
  no: {type: Number, required: true, unique: true},
  clientName: {type: String, required: true},
  clientAddress: {type: String},
  clientTIN: {type: String},
  dcNo: {type: Number},
  date: {type: Date, default: Date.now},
  description: {type: String},
  items: [{
    no: {type: Number, required: true},
    description: {type: String},
    quantity: {type: Number, required: true},
    unitPrice: {type: Number, required: true}
  }],
  vatPercent: {type: Number, default: 5},
  hideQtyRate: {type: Boolean, default: false}
});

invoiceSchema.statics.getNextBillNo = function () {
  return this.findOne({}, 'no').sort({no: -1}).then(
    (data) => {
      return data.no + 1;
    }
  );
};

invoiceSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Invoice', invoiceSchema);
