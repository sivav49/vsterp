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

  getModelFromRequest(req) {
    let body = req.body;
    let res = req.modelObj;
    if(!res) {
      res = new this();
    }
    let items = [];
    let i, length = body.items.length;
    for (i = 0; i < length; i++) {
      let item = body.items[i];
      items.push({
        no: i,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      });
    }
    res.clientName = body.clientName;
    res.clientAddress = body.clientAddress;
    res.clientTIN = body.clientTIN;
    res.dcNo = body.dcNo;
    res.date = moment.utc(moment(body.date).format('DD-MM-YYYY'), 'DD-MM-YYYY');
    res.description = body.description;
    res.items = items;
    res.vatPercent = body.vatPercent;

    return res;
  },

  getNextInvoiceNo() {
    return this.findOne({}, '_id').sort({_id: -1}).then(
      (invoice) => {
        return invoice._id + 1;
      }
    );
  }
};

const Invoice = mongoose.model('Invoice', invoiceSchema);

const invoiceItemSchema = Joi.object({
  description: Joi.string().required(),
  quantity: Joi.number().required(),
  unitPrice: Joi.number().required()
}).required();

const invoiceItemArraySchema = Joi
  .array()
  .items(invoiceItemSchema)
  .min(1)
  .required();

const paramValidation = {
  create: {
    body: {
      clientName: Joi.string().required(),
      clientAddress: Joi.string().required(),
      clientTIN: Joi.string().allow(''),
      dcNo: Joi.string().allow(''),
      date: Joi.date().format('DD-MM-YYYY').required(),
      description: Joi.string().allow(''),
      items: Joi.alternatives().try(invoiceItemSchema, invoiceItemArraySchema).required(),
      vatPercent: Joi.number(),
    }
  },

  update: {
    body: {
      clientName: Joi.string().required(),
      clientAddress: Joi.string().required(),
      clientTIN: Joi.string().allow(''),
      dcNo: Joi.string().allow(''),
      date: Joi.date().format('DD-MM-YYYY').required(),
      description: Joi.string().allow(''),
      items: Joi.alternatives().try(invoiceItemSchema, invoiceItemArraySchema).required(),
      vatPercent: Joi.number(),
    },
    params: {
      _id: Joi.string().required()
    }
  }
};

let InvoiceVatModel = {
  Invoice,
  paramValidation
};

module.exports = InvoiceVatModel;
