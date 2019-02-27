var express = require('express');
var router = express.Router();
var User = require('../models/user');

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;



/*router.get('/reminders', function(req, res, next) {
  var reminderList = [];
  var remindOn = new Date(2018, 7, 20);
  var text = 'Have to get my car checked';
  var reminder = {
    remindOn: remindOn,
    text:text
  }
  reminderList.push(reminder);
  remindOn = new Date(2018, 7, 16);
  text = 'Alo wala paratha';
  reminder = {
    remindOn: remindOn,
    text:text
  }
  reminderList.push(reminder);
  res.send(reminderList);
});

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
});*/


router.post('/getSettings', function(req, res, next) {
  console.log("In get settings");
  console.log(req.body.username);
  var db = req.db;
  var widgetCollection = db.get("widgets");
  widgetCollection.find({'username':req.body.username}, {}, function(err, widgets){
    console.log(widgets)
    if(widgets.length == 0){
      console.log('no settings for this user');
      res.send('no settings');
    }
    else{
      console.log('settings for this user exist');
      res.send(widgets[0]);
    }
  })
});


router.post('/db_reminders', function(req, res, next) {
  console.log("In reminders");
  console.log(req.body);
  
  var db = req.db;

  var remindersCollection = db.get("reminders");
  
  remindersCollection.find({username:req.body.username}, {}, function(err, reminders){
      console.log('creating reminder for this user');
      remindersCollection.insert({
        description: req.body.desc, 
        date: req.body.date, 
        username: req.body.username
      })
  })
  res.send('Reminder added');
});


router.post('/get_reminders', function(req, res, next) {
  console.log("In get_reminders");
  console.log(req.body.username);
  var db = req.db;
  var widgetCollection = db.get("reminders");
  widgetCollection.find({'username':req.body.username}, {}, function(err, reminders){
    console.log(reminders)
    if(reminders.length == 0){
      console.log('no reminders for this user');
      res.send('no reminders');
    }
    else{
      console.log('reminders for this user exist');
      console.log(reminders)
      res.send(reminders);
    }
  })
});





/*router.post('/login', passport.authenticate('local', {failureRedirect:'/users/fail'}), function(req,res,next){
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
});*/


module.exports = router;