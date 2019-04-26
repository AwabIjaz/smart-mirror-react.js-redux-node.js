var createError = require('http-errors');
var express = require('express');
var path = require('path');
const cors = require('cors');

var cookieParser = require('cookie-parser');
var compression = require('compression');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var facialRouter = require('./routes/facial');


var db = require('monk')('mongodb://legolas427:proton27@ds127429.mlab.com:27429/mine');
require('dotenv').config();

var dest = process.env.WINDOWS_PATH; //change on rpi
var wake = process.env.PORCUPINE_PATH; //change on rpi

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());

app.use(function(req,res,next){
  req.db = db;
  next();
});

//to pass path in all files.
app.use(function(req,res,next){
  req.dest = dest;
  req.wake = wake;
  next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/facial', facialRouter);


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

module.exports = app;
