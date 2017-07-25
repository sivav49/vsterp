let {Client} = require('./client.model');
let APIController = require('../api.controller');

class ClientController extends APIController {
  constructor() {
    super(Client);
    this.load = this.load.bind(this);
    this.list = this.list.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }
}

module.exports = new ClientController();
