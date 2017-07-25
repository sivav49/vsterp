let APIController = require('../api.controller');

function getApiMethods(InvoiceModel) {
  class InvoiceController extends APIController {
    constructor() {
      super(InvoiceModel.Invoice);
      this.load = this.load.bind(this);
      this.list = this.list.bind(this);
      this.get = this.get.bind(this);
      this.create = this.create.bind(this);
      this.update = this.update.bind(this);
      this.remove = this.remove.bind(this);
    }

    create(req, res, next) {
      const invoice = this.model.getModelFromRequest(req);
      this.model.getNextInvoiceNo().then(
        (_id) => {
          invoice._id = _id;
          invoice.save()
            .then(data => APIController.submitJson(res, data))
            .catch(e => next(e));
        }
      ).catch(e => next(e));
    }
  }

  return new InvoiceController();
}

module.exports = getApiMethods;
