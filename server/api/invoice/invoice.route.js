let express = require('express');
let validate = require('express-validation');
let controller = require('./invoice.controller');

function getRouter(InvoiceModel) {
  const router = express.Router();

  const vatController = controller(InvoiceModel);

  router.route('/')
    .get(vatController.list)
    .post(validate(InvoiceModel.paramValidation.create), vatController.create);

  router.route('/:_id')
    .get(vatController.get)
    .put(validate(InvoiceModel.paramValidation.update), vatController.update)
    .delete(vatController.remove);

  router.param('_id', vatController.load);

  return router;
}

module.exports = getRouter;
