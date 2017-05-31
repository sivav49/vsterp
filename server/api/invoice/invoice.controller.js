let {Invoice, getModelFromRequest} = require('./invoice.model');

function load(req, res, next, invoiceNo) {
  Invoice.get(invoiceNo)
    .then((data) => {
      req.invoice = data;
      return next();
    })
    .catch(e => next(e));
}

function get(req, res) {
  return submitJson(res, req.invoice);
}

function create(req, res, next) {
  const invoice = getModelFromRequest(req);
  Invoice.getNextInvoiceNo().then(
    (no) => {
      invoice.no = no;
      invoice.save()
        .then(data => submitJson(res, data))
        .catch(e => next(e));
    }
  ).catch(e => next(e));
}

function update(req, res, next) {
  const invoice = getModelFromRequest(req);
  invoice.save()
    .then(data => submitJson(res, data))
    .catch(e => next(e));
}

function list(req, res, next) {
  const {limit = 15, skip = 0} = req.query;
  Invoice.list({limit, skip})
    .then(data => submitJson(res, data))
    .catch(e => next(e));
}

function remove(req, res, next) {
  const invoice = req.invoice;
  invoice.remove()
    .then(data => submitJson(res, data))
    .catch(e => next(e));
}

// function destroy(req, res) {
//   let no = req.params.no;
//   Invoice.findOneAndRemove({no: no})
//     .then(sendJson(res), errorHandler(res));
// }

// function sendJson(res, successStatus) {
//   successStatus = successStatus || 200;
//   return function (data) {
//     if (data === null) {
//       res.sendStatus(404);
//     } else {
//       res.status(successStatus).json({
//         message: "success",
//         data: data
//       });
//     }
//   }
// }
//
// function errorHandler(res, data) {
//   return function (err) {
//     res.status(500).send("Error occurred " + err);
//   }
// }

function submitJson(res, data) {
  return res.json({
    message: 'success',
    data: data
  });
}

module.exports = {load, get, create, update, list, remove};
