function getApiMethods(InvoiceModel) {
  const Invoice = InvoiceModel.Invoice;

  const load = function (req, res, next, invoiceNo) {
    Invoice.get(invoiceNo)
      .then((data) => {
        req.invoice = data;
        return next();
      })
      .catch(e => next(e));
  };

  const list = function (req, res, next) {
    const {limit = 15, skip = 0} = req.query;
    Invoice.list({limit, skip})
      .then(data => submitJson(res, data))
      .catch(e => next(e));
  };

  const get = function (req, res) {
    return submitJson(res, req.invoice);
  };

  const create = function (req, res, next) {
    const invoice = InvoiceModel.getModelFromRequest(req);
    Invoice.getNextInvoiceNo().then(
      (_id) => {
        invoice._id = _id;
        return invoice.save()
          .then(data => submitJson(res, data))
          .catch(e => next(e));
      }
    ).catch(e => next(e));
  };

  const update = function (req, res, next) {
    const invoice = InvoiceModel.getModelFromRequest(req);
    invoice.save()
      .then(data => submitJson(res, data))
      .catch(e => next(e));
  };

  const remove = function (req, res, next) {
    const invoice = req.invoice;
    invoice.remove()
      .then(data => submitJson(res, data))
      .catch(e => next(e));
  };

  function submitJson(res, data) {
    return res.json({
      message: 'success',
      data: data
    });
  }

  return {load, get, create, update, list, remove};
}

module.exports = getApiMethods;
