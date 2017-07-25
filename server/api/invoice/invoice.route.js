let express = require('express');
let validate = require('express-validation');
let invoiceController = require('./invoice.controller');

function getRouter(InvoiceModel) {
  const router = express.Router();

  const controller = invoiceController(InvoiceModel);

  router.route('/')
    .get(controller.list)
    .post(validate(InvoiceModel.paramValidation.create), controller.create);

  router.route('/:_id')
    .get(controller.get)
    .put(validate(InvoiceModel.paramValidation.update), controller.update)
    .delete(controller.remove);

  router.param('_id', controller.load);

  return router;
}

module.exports = getRouter;
