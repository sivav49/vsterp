let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

let app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/vsterpdb');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (app.get("env") === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));
  app.get('*', function (req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, "../dist")});
  });
} else {
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://192.168.1.104:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'db connection error:'));
  db.once('open', console.log.bind(console, 'db connected'));
}

let router = express.Router();
router.use('/invoice', require('./api/invoice/invoice.controller'));
router.use('/client', require('./api/client/client.controller'));
app.use('/api', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message,
  });
});

module.exports = app;
