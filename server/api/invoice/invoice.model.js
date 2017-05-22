let mongoose = require('mongoose');
let mongooseUniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let invoiceSchema = new Schema({
  client: {type: String, required: true},
  billNo: {type: Number, required: true, unique: true},
  challanNo: {type: Number},
  date: {type: Date, default: Date.now},
  description: {type: String},
  items: [{
    description: {type: String},
    quantity: {type: Number},
    rate: {type: Number}
  }],
  vatPercent: {type: Number, default: 5},
  hideQtyRate: {type: Boolean, default: false}
});

invoiceSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Invoice', invoiceSchema);
