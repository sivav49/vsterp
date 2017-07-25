const APIController = class APIController {
  static submitJson(res, data) {
    return res.json({
      message: 'success',
      data: data
    });
  }

  constructor(model) {
    this.model = model;
  }

  load(req, res, next, id) {
    this.model.get(id)
      .then((data) => {
        req.modelObj = data;
        next();
        return null;
      })
      .catch(e => next(e));
  }

  list(req, res, next) {
    const {limit = 50, skip = 0} = req.query;
    this.model.list({limit, skip})
      .then(data => APIController.submitJson(res, data))
      .catch(e => next(e));
  }

  get(req, res) {
    return APIController.submitJson(res, req.modelObj);
  }

  create(req, res, next) {
    const obj = this.model.getModelFromRequest(req);
    obj.save()
      .then(data => APIController.submitJson(res, data))
      .catch(e => next(e));
  }

  update(req, res, next) {
    const obj = this.model.getModelFromRequest(req);
    obj.save()
      .then(data => APIController.submitJson(res, data))
      .catch(e => next(e));
  }

  remove(req, res, next) {
    const obj = req.modelObj;
    obj.remove()
      .then(data => APIController.submitJson(res, data))
      .catch(e => next(e));
  }
};

module.exports = APIController;
