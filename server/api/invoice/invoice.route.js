let express = require('express');
let validate = require('express-validation');
let controller = require('./invoice.controller');
let {paramValidation} = require('./invoice.model');
const router = express.Router();

router.route('/')
  .get(controller.list)
  .post(validate(paramValidation.create), controller.create);

router.route('/:_id')
  .get(controller.get)
  .put(validate(paramValidation.update), controller.update)
  .delete(controller.remove);

router.param('_id', controller.load);

module.exports = router;
