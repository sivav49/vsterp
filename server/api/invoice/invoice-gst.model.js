let Promise = require('bluebird');
let mongoose = require('mongoose');
let httpStatus = require('http-status');
let APIError = require('../../helpers/APIError');

const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);

let mongooseUniqueValidator = require('mongoose-unique-validator');
let moment = require('moment');

let Schema = mongoose.Schema;

let invoiceSchema = new Schema({
  _id: {
    type: Number,
    required: true,
    unique: true
  },
  date: {type: Date, default: Date.now},
  recipientName: {
    type: String,
    required: true
  },
  recipientAddress: {type: String},
  recipientState: {type: String},
  recipientStateCode: {type: String},
  recipientGSTIN: {type: String},
  consigneeName: {
    type: String,
    required: true
  },
  consigneeAddress: {type: String},
  consigneeState: {type: String},
  consigneeStateCode: {type: String},
  consigneeGSTIN: {type: String},
  items: [{
    no: {type: Number, required: true},
    description: {type: String, required: true},
    hsn: {type: String, required: true},
    quantity: {type: Number, required: true},
    unitPrice: {type: Number, required: true},
    cgst: {type: Number, required: true},
    sgst: {type: Number, required: true},
    igst: {type: Number, required: true}
  }],
});

invoiceSchema.plugin(mongooseUniqueValidator);

invoiceSchema.statics = {
  get(invoiceNo) {
    return this.findById(invoiceNo)
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
      .sort({_id: -1})
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  getNextInvoiceNo() {
    return this.findOne({}, '_id').sort({_id: -1}).then(
      (invoice) => {
        if(invoice) {
          return invoice._id + 1;
        } else {
          return 1;
        }
      }
    );
  }
};

const Invoice = mongoose.model('InvoiceGst', invoiceSchema);

function getModelFromRequest(req) {
  let body = req.body;
  let res = req.invoice;
  if (!res) {
    res = new Invoice();
  }
  let items = [];
  let i, length = body.items.length;
  for (i = 0; i < length; i++) {
    let item = body.items[i];
    items.push({
      no: i,
      description: item.description,
      hsn: item.hsn,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      cgst: item.cgst,
      sgst: item.sgst,
      igst: item.igst
    });
  }
  res.recipientName = body.recipientName;
  res.recipientAddress = body.recipientAddress;
  res.recipientState = body.recipientState;
  res.recipientStateCode = body.recipientStateCode;
  res.recipientGSTIN = body.recipientGSTIN;
  res.consigneeName = body.consigneeName;
  res.consigneeAddress = body.consigneeAddress;
  res.consigneeState = body.consigneeState;
  res.consigneeStateCode = body.consigneeStateCode;
  res.consigneeGSTIN = body.consigneeGSTIN;
  res.date = moment.utc(moment(body.date).format('DD-MM-YYYY'), 'DD-MM-YYYY');
  res.items = items;

  return res;
}

const invoiceItemSchema = Joi.object({
  description: Joi.string().required(),
  hsn: Joi.string().required(),
  quantity: Joi.number().required(),
  unitPrice: Joi.number().required(),
  cgst: Joi.number().required(),
  sgst: Joi.number().required(),
  igst: Joi.number().required(),
}).required();

const invoiceItemArraySchema = Joi
  .array()
  .items(invoiceItemSchema)
  .min(1)
  .required();

const paramValidation = {
  create: {
    body: {
      date: Joi.date().iso().required(),
      recipientName: Joi.string().required(),
      recipientAddress: Joi.string().required(),
      recipientState: Joi.string().required(),
      recipientStateCode: Joi.string().required(),
      recipientGSTIN: Joi.string().required(),
      consigneeName: Joi.string().required(),
      consigneeAddress: Joi.string().required(),
      consigneeState: Joi.string().required(),
      consigneeStateCode: Joi.string().required(),
      consigneeGSTIN: Joi.string().required(),
      items: Joi.alternatives().try(invoiceItemSchema, invoiceItemArraySchema).required(),
    }
  },

  update: {
    body: {
      date: Joi.date().iso().required(),
      recipientName: Joi.string().required(),
      recipientAddress: Joi.string().required(),
      recipientState: Joi.string().required(),
      recipientStateCode: Joi.string().required(),
      recipientGSTIN: Joi.string().required(),
      consigneeName: Joi.string().required(),
      consigneeAddress: Joi.string().required(),
      consigneeState: Joi.string().required(),
      consigneeStateCode: Joi.string().required(),
      consigneeGSTIN: Joi.string().required(),
      items: Joi.alternatives().try(invoiceItemSchema, invoiceItemArraySchema).required(),
    },
    params: {
      _id: Joi.string().required()
    }
  }
};

let InvoiceGstModel = {
  Invoice,
  getModelFromRequest,
  paramValidation
};

module.exports = InvoiceGstModel;
