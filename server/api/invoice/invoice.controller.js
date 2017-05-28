let express = require('express');
let router = express.Router();

let Invoice = require('./invoice.model');

router.get('/', getAll);
router.get('/:no', getById);
router.post('/', create);
router.put('/:no', update);
router.patch('/:no', update);
router.delete('/:no', destroy);

module.exports = router;

function getAll(req, res) {
  Invoice.find({}).sort({no: -1}).limit(15)
    .then(sendJson(res), errorHandler(res));
}

function getById(req, res) {
  Invoice.findOne({no: req.params.no})
    .then(sendJson(res), errorHandler(res));
}

function create(req, res) {
  let reqModel = getModelFromRequestBody(req);
  Invoice.getNextBillNo().then(
    (no) => {
      reqModel.no = no;
      let invoice = new Invoice(reqModel);
      invoice.save()
        .then(sendJson(res, 201), errorHandler(res));
    }
  );
}

function update(req, res) {
  let reqModel = getModelFromRequestBody(req);
  let no = req.params.no;
  delete reqModel.no;
  Invoice.findOneAndUpdate({no: no}, reqModel, {new: true})
    .then(sendJson(res), errorHandler(res));
}

function destroy(req, res) {
  let no = req.params.no;
  Invoice.findOneAndRemove({no: no})
    .then(sendJson(res), errorHandler(res));
}

function getModelFromRequestBody(req) {
  let body = req.body;
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
  return {
    no: body.no,
    clientName: body.clientName,
    clientAddress: body.clientAddress,
    clientTIN: body.clientTIN,
    dcNo: body.dcNo,
    date: Date.parse(body.date),
    description: body.description,
    items: items,
    vatPercent: body.vatPercent,
    hideQtyRate: body.hideQtyRate
  }
}

function sendJson(res, successStatus) {
  successStatus = successStatus || 200;
  return function (data) {
    if (data === null) {
      res.sendStatus(404);
    } else {
      res.status(successStatus).json({
        message: "success",
        data: data
      });
    }
  }
}

function errorHandler(res, data) {
  return function (err) {
    res.status(500).send("Error occurred " + err);
  }
}
