var express = require('express');
var router = express.Router();
var User = require('../models/user');

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

router.post('/register', function(req, res, next) {
  console.log("In register user");
  console.log(req.body);
  var nameRequired = 'Name required';
    var emailRequired = 'Email required';
    var emailInvalid = 'Invalid email';
    var usernameRequired = 'Username required';
    var passwordRequired = 'Password required';
    var passwordSame = 'Both passwords must be same';
    req.checkBody('name', nameRequired).notEmpty();
    req.checkBody('email', emailRequired).notEmpty();
    req.checkBody('email', emailInvalid).isEmail();
    req.checkBody('username', usernameRequired).notEmpty();
    req.checkBody('password', passwordRequired).notEmpty();
    req.checkBody('password2', passwordSame).equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
      console.log(errors);
        res.send(errors);
    }
    else{
      var newUser = new User(req.body); 
    // create User
    User.createUser(newUser, function(err,user){
      if(err) throw err;
    });
    res.send('User added');
    }
});

router.post('/setting', function(req, res, next) {
  console.log("In setting");
  console.log(req.body);
  
  var db = req.db;

  var widgetCollection = db.get("widgets");
  
  widgetCollection.find({username:req.body.username}, {}, function(err, widgets){
    if(widgets.length == 0){
      console.log('creating settings for this user');
      widgetCollection.insert({
        username: req.body.username,
        w1: req.body.w1, 
        w2: req.body.w2, 
        w3: req.body.w3, 
        w4: req.body.w4
      })
    }
    else{
      console.log('settings for this user exist');
      widgetCollection.update(
      { username: req.body.username },
      {
        username:req.body.username,
        w1: req.body.w1, 
        w2: req.body.w2, 
        w3: req.body.w3, 
        w4: req.body.w4
      })
    }
  })
  res.send('User added');
});


router.post('/login', passport.authenticate('local', {failureRedirect:'/users/fail'}), function(req,res,next){
  console.log(req.user.name);
  res.send('success');
});

router.get('/fail', function(req,res,next){
  console.log('fail');
  res.send('fail');
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false);
      }
    User.comparePassword(password, user.password, function(err, isMatch) {
            if (err) throw err;
            if(isMatch){
              return done(null, user);
            }
            else{
              return done(null, false);
            }
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = router;