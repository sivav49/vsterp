let express = require('express');
let logger = require('morgan');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let compress = require('compression');
let methodOverride = require('method-override');
let cors = require('cors');
let httpStatus = require('http-status');
let expressValidation = require('express-validation');
let helmet = require('helmet');
let MongooseError = require('mongoose').Error;
let path = require('path');

let apiRoutes = require('../server/api/api.route');
let config = require('./config');
let APIError = require('../server/helpers/APIError');

const app = express();

if (config.env === 'development') {
  app.use(logger('dev'));
  // enable CORS - Cross Origin Resource Sharing
  app.use(cors());
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// secure apps by setting various HTTP headers
app.use(helmet());

app.use('/api', apiRoutes);

if (config.env === 'development') {

} else {
  app.use(express.static(path.join(__dirname, "../dist")));
  app.get('*', function (req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, "../dist")});
  });
}

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (err instanceof MongooseError) {
    const mongooseError = err.errors._id;
    const apiError = new APIError(mongooseError.message, err.status, err.isPublic);
    return next(apiError);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status).json({
      message: err.isPublic ? err.message : httpStatus[err.status],
      //stack: config.env === 'development' ? err.stack : {}
    })
  }
);

module.exports = app;
