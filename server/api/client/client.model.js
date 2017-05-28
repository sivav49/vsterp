let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let clientSchema = new Schema({
  cName: {type: String, required: true},
  addrl1: {type: String},
  addrl2: {type: String},
  state: {type: String},
  city: {type: String},
  pincode: {type: String},
  tin: {type: String},
  email: {type: String},
  phone: {type: String},
});

module.exports = mongoose.model('Client', clientSchema);
