var createError = require('http-errors'); // extends http-errors
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); // parse cookie header, populate req.cookies with obj keyed by cookie names
var logger = require('morgan'); // logger for errors
// var Joi = require('joi');
var log = require('./middleware/logger');
var debugMain = require('debug')('app:main');
var debugDb = require('debug')('app:db');
const winston = require('winston'); // logger
const port = process.env.PORT || 3000;
var app = express();

debugMain('this is a debug message when env var DEBUG=app:main');
debugDb('this is a debug message when env var DEBUG=app:db');
// export DEBUG=app:main,app:db // this will add both namespaces to DEBUG and both will console
// export DEBUG=app:* // will console all debugs

require('./startup/logging')();
require('./startup/db')();
require('./startup/config')();
var indexRouter = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
// builtin middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // can send post via x-www-form-urlencoded
app.use(express.static('public')); // designates root for url for accessing static files
// ie: localhost:3000/images/image.png is url for image

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(log);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.listen(port, () => console.log(`Listening on port ${port}...`));
app.listen(port, () => winston.info(`Listening on port ${port}...`));

// function validateCourse(course) {
//   const schema = {
//     name: Joi.string().min(3).required(),
//   };

//   return Joi.validate(course, schema);
// }

module.exports = app;
