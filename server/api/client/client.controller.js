let {Client, getModelFromRequest} = require('./client.model');

function load(req, res, next, id) {
  Client.get(id)
    .then((data) => {
      req.clientData = data;
      next();
      return null;
    })
    .catch(e => next(e));
}

function list(req, res, next) {
  const {limit = 50, skip = 0} = req.query;
  Client.list({limit, skip})
    .then(data => submitJson(res, data))
    .catch(e => next(e));
}

function get(req, res) {
  return submitJson(res, req.clientData);
}

function create(req, res, next) {
  const client = getModelFromRequest(req);
  client.save()
    .then(data => submitJson(res, data))
    .catch(e => next(e));
}

function update(req, res, next) {
  const client = getModelFromRequest(req);
  client.save()
    .then(data => submitJson(res, data))
    .catch(e => next(e));
}

function remove(req, res, next) {
  const client = req.clientData;
  client.remove()
    .then(data => submitJson(res, data))
    .catch(e => next(e));
}

function submitJson(res, data) {
  return res.json({
    message: 'success',
    data: data
  });
}

module.exports = {load, get, create, update, list, remove};
