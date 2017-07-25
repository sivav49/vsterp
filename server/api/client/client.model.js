let Promise = require('bluebird');
let mongoose = require('mongoose');
let httpStatus = require('http-status');
let APIError = require('../../helpers/APIError');
let Joi = require('joi');
let mongooseUniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let clientSchema = new Schema({
  _id: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  addrl1: {type: String},
  addrl2: {type: String},
  state: {type: String},
  city: {type: String},
  pincode: {type: String},
  tin: {type: String},
  gstin: {type: String},
  email: {type: String},
  phone: {type: String},
});

clientSchema.plugin(mongooseUniqueValidator);

clientSchema.statics = {
  get(id) {
    return this.findById(id)
      .exec()
      .then((client) => {
        if (client) {
          return client;
        }
        const err = new APIError('No such client exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  list({skip = 0, limit = 50} = {}) {
    return this.find()
      .sort({name: -1})
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  getModelFromRequest(req) {
    let body = req.body;
    let res = req.modelObj;
    if (!res) {
      res = new this();
      res._id = body._id;
    }
    res.name = body.name;
    res.addrl1 = body.addrl1;
    res.addrl2 = body.addrl2;
    res.state = body.state;
    res.city = body.city;
    res.pincode = body.pincode;
    res.tin = body.tin;
    res.gstin = body.gstin;
    res.email = body.email;
    res.phone = body.phone;

    return res;
  }
};

const Client = mongoose.model('Client', clientSchema);

const paramValidation = {
  create: {
    body: {
      _id: Joi.string().alphanum().min(3).max(15).required().required(),
      name: Joi.string().required(),
      addrl1: Joi.string().allow(''),
      addrl2: Joi.string().allow(''),
      state: Joi.string().allow(''),
      city: Joi.string().allow(''),
      pincode: Joi.string().allow(''),
      tin: Joi.string().allow(''),
      gstin: Joi.string().allow(''),
      email: Joi.string().allow(''),
      phone: Joi.string().allow(''),
    }
  },

  update: {
    body: {
      name: Joi.string().required(),
      addrl1: Joi.string().allow(''),
      addrl2: Joi.string().allow(''),
      state: Joi.string().allow(''),
      city: Joi.string().allow(''),
      pincode: Joi.string().allow(''),
      tin: Joi.string().allow(''),
      gstin: Joi.string().allow(''),
      email: Joi.string().allow(''),
      phone: Joi.string().allow(''),
    },
    params: {
      _id: Joi.string().required()
    }
  },
};

module.exports = {Client, paramValidation};
