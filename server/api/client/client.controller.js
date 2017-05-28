let express = require('express');
let router = express.Router();

let Client = require('./client.model');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.patch('/:id', update);
router.delete('/:id', destroy);

module.exports = router;

function getAll(req, res) {
  Client.find({}).sort({cName: -1})
    .then(sendJson(res), errorHandler(res));
}

function getById(req, res) {
  Client.findOne({_id: req.params.id})
    .then(sendJson(res), errorHandler(res));
}

function create(req, res) {
  let reqModel = getModelFromRequestBody(req);
  let client = new Client(reqModel);
  client.save()
    .then(sendJson(res, 201), errorHandler(res));
}

function update(req, res) {
  let reqModel = getModelFromRequestBody(req);
  let id = req.params.id;
  delete reqModel._id;
  Client.findOneAndUpdate({_id: id}, reqModel, {new: true})
    .then(sendJson(res), errorHandler(res));
}

function destroy(req, res) {
  let id = req.params.id;
  Client.findOneAndRemove({_id: id})
    .then(sendJson(res), errorHandler(res));
}

function getModelFromRequestBody(req) {
  let body = req.body;
  let res = {};
  if (body._id !== undefined) {
    res._id = body._id;
  }

  res.cName = body.cName;
  res.addrl1 = body.addrl1;
  res.addrl2 = body.addrl2;
  res.state = body.state;
  res.city = body.city;
  res.pincode = body.pincode;
  res.tin = body.tin;
  res.email = body.email;
  res.phone = body.phone;

  return res;
}

function sendJson(res) {
  return function (data) {
    if (data === null) {
      res.sendStatus(404);
    } else {
      res.status(200).json({
        message: 'success',
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
