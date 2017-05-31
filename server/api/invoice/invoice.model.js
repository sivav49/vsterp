let Promise = require('bluebird');
let mongoose = require('mongoose');
let httpStatus = require('http-status');
let APIError = require('../../helpers/APIError');
let Joi = require('joi');
let mongooseUniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let invoiceSchema = new Schema({
  no: {
    type: Number,
    required: true,
    unique: true
  },
  clientName: {
    type: String,
    required: true
  },
  clientAddress: {type: String},
  clientTIN: {type: String},
  dcNo: {type: String},
  date: {type: Date, default: Date.now},
  description: {type: String},
  items: [{
    no: {type: Number, required: true},
    description: {type: String},
    quantity: {type: Number, required: true},
    unitPrice: {type: Number, required: true}
  }],
  vatPercent: {type: Number, default: 5},
});

invoiceSchema.plugin(mongooseUniqueValidator);

invoiceSchema.statics = {
  get(invoiceNo) {
    return this.findOne({no: invoiceNo})
      .exec()
      .then((invoice) => {
        if (invoice) {
          return invoice;
        }
        const err = new APIError('No such invoice exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  list({skip = 0, limit = 50} = {}) {
    return this.find()
      .sort({no: -1})
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  getNextInvoiceNo() {
    return this.findOne({}, 'no').sort({no: -1}).then(
      (invoice) => {
        return invoice.no + 1;
      }
    );
  }
};

const Invoice = mongoose.model('Invoice', invoiceSchema);

function getModelFromRequest(req) {
  let body = req.body;
  let res = req.invoice;
  if(!res) {
    res = new Invoice();
  }
  let items = [];
  let i, length = body.items.length;
  for (i = 0; i < length; i++) {
    let item = body.items[i];
    items.push({
      no: item.no,
      description: item.description,
      quantity: item.quantity,
      rate: item.rate
    });
  }
  res.clientName = body.clientName;
  res.clientAddress = body.clientAddress;
  res.clientTIN = body.clientTIN;
  res.dcNo = body.dcNo;
  res.date = Date.parse(body.date);
  res.description = body.description;
  res.items = items;
  res.vatPercent = body.vatPercent;

  return res;
}

const invoiceItemSchema = Joi.object({
  no: Joi.number().required(),
  description: Joi.string().required(),
  quantity: Joi.number().required(),
  unitPrice: Joi.number().required()
}).required();

const invoiceItemArraySchema = Joi
  .array()
  .items(invoiceItemSchema)
  .min(1)
  .unique("no")
  .required();

const paramValidation = {
  create: {
    body: {
      clientName: Joi.string().required(),
      clientAddress: Joi.string().required(),
      clientTIN: Joi.string().allow(''),
      dcNo: Joi.string().allow(''),
      date: Joi.date().required(),
      description: Joi.string().allow(''),
      items: Joi.alternatives().try(invoiceItemSchema, invoiceItemArraySchema).required(),
      vatPercent: Joi.number().required(),
    }
  },

  update: {
    body: {
      clientName: Joi.string().required(),
      clientAddress: Joi.string().required(),
      clientTIN: Joi.string().allow(''),
      dcNo: Joi.string().allow(''),
      date: Joi.date().required(),
      description: Joi.string().allow(''),
      items: Joi.alternatives().try(invoiceItemSchema, invoiceItemArraySchema).required(),
      vatPercent: Joi.number().required(),
    },
    params: {
      _id: Joi.string().required()
    }
  }
};



module.exports = {Invoice, getModelFromRequest, paramValidation};
