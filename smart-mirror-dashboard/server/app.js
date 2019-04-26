var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var faceRouter = require('./routes/face');
var mobileRouter = require('./routes/mobile');

var User = require('./models/user');

require('dotenv').config();


const mongoose = require('mongoose');
var passport = require('passport');

var db = require('monk')('mongodb://legolas427:proton27@ds127429.mlab.com:27429/mine');
const options = {
  useNewUrlParser: true
};
mongoose.connect('mongodb://legolas427:proton27@ds127429.mlab.com:27429/mine', options);

app.use(logger('dev'));
app.use(passport.initialize());
app.use(passport.session());


app.use(cors());

app.use(expressValidator({
  customValidators: {
    usernameExistsAsync: async function (value) {
      var user = await Users.find({ username: value })
      return user.length == 0;
    },
    usernameExistsPromise: function (value) {
      Users.find({ username: value })
        .then(function (result) {
          return result.length == 0
        })
        .catch(function (err) { console.log(err) })
    }
  }
})
)

app.use(function(req,res, next){
	req.io = io;
	next();
});

// // validator 
// app.use(expressValidator({
//   errorFormatter: function(param, msg, value) {
//       var namespace = param.split('.')
//       , root    = namespace.shift()
//       , formParam = root;

//     while(namespace.length) {
//       formParam += '[' + namespace.shift() + ']';
//     }
//     return {
//       param : formParam,
//       msg   : msg,
//       value : value
//     };
//   }
// }));

app.use(function (req, res, next) {
  req.db = db;
  next();
});

app.use(expressValidator({
  customValidators: {
    gte: function (param, num) {
      return param >= num;
    }
  }
}));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/face', faceRouter);
app.use('/mobile', mobileRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.set('port', (process.env.PORT || 5000));

http.listen(app.get('port'), function(){
	console.log('listening on port');
});