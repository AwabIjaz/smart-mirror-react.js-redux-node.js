var express = require('express');
var router = express.Router();


router.post('/getSettings', function(req, res, next) {
  console.log("In get settings");
  console.log(req.body.username);
  var db = req.db;
  var widgetCollection = db.get("widgets");
  widgetCollection.find({'username':req.body.username}, {}, function(err, widgets){
    console.log(widgets)
    if(widgets && widgets.length !== 0){
      console.log('settings for this user exist');
      res.status(200).send(widgets[0]);
    }
    else{
      console.log('no settings for this user');
      res.status(200).send('no settings');
    }
  })
});

router.post('/db_alarms', function(req, res, next) {
  console.log("In alarms");
  console.log(req.body);
  
  var db = req.db;

  var alarmsCollection = db.get("alarms");
  
  alarmsCollection.find({username:req.body.username}, {}, function(err, alarms){
      console.log('creating alarm for this user');
      alarmsCollection.insert({
        day: req.body.day, 
        time: req.body.time, 
        dayNumber: req.body.dayNumber,
        hours: req.body.hours,
        minutes: req.body.minutes,
        username: req.body.username
      })
  })
  res.status(200).send('New Alarm Set');
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
  res.status(200).send('Reminder added');
});

router.post('/get_reminders', function(req, res, next) {
  console.log("In get_reminders");
  console.log(req.body.username);
  var db = req.db;
  var widgetCollection = db.get("reminders");
  widgetCollection.find({'username':req.body.username}, {}, function(err, reminders){
    console.log(reminders)
    if(reminders && reminders.length !== 0){
      console.log('reminders for this user exist');
      console.log(reminders)
      res.status(200).send(reminders);
    }
    else{
      console.log('no reminders for this user');
      res.status(200).send('no reminders');
    }
  })
});

module.exports = router;