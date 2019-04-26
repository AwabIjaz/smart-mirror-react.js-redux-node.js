var express = require('express');
var router = express.Router();

router.post('/login', function(req, res, next) {
    res.status(200).send({msg:"Trying to Log in!"});
    req.io.emit('login', req.body.username);
});

router.post('/logout', function(req, res, next) {
    res.status(200).send({msg:"Trying to Log out!"});
    req.io.emit('logout', req.body.username);
});

router.post('/response', function(req, res, next) {
    res.status(200).send("Response Sent!");
    console.log("username? "+req.body.username);
    req.io.emit(req.body.username, req.body.response);
});

router.get('/refresh', function(req, res, next) {
    res.status(200).send({msg:"Request Sent!"});
    console.log('refresh');
    req.io.emit('refresh');
});


router.get('/changeState', function(req, res, next) {
    res.status(200).send({msg:"Request Sent!"});
    console.log('changeState');
    req.io.emit('changeState');
});


router.post('/getAlarms', function(req, res, next) {
  console.log("In get_alarms");
  console.log(req.body.username);
  var db = req.db;
  var alarmsCollection = db.get("alarms");
  alarmsCollection.find({'username':req.body.username}, {}, function(err, alarms){
    console.log(alarms)
    if(alarms && alarms.length !== 0){
      console.log('alarms for this user exist');
      res.status(200).send(alarms);
    }
    else{
      console.log('no alarms for this user');
      res.status(200).send({msg:'no alarms'});
    }
  })
});

router.post('/sendAlarm', function(req, res, next) {
  const alarm = {
    day: req.body.day, 
    time: req.body.time, 
    dayNumber: req.body.dayNumber,
    hours: req.body.hours,
    minutes: req.body.minutes,
    username: req.body.username
  }
  res.status(200).send('Alarm Sent!');
  req.io.emit(req.body.username + ' alarms', alarm);
});

router.post('/addReminder', function(req, res, next) {
  console.log("In add reminders");
  console.log(req.body);
  
  var db = req.db;

  var remindersCollection = db.get("reminders");
  
  remindersCollection.find({username:req.body.username}, {}, function(err, reminders){
    console.log('creating reminder for this user');
    remindersCollection.insert({
      description: req.body.text, 
      date: req.body.date, 
      username: req.body.username
    })
    req.io.emit('reminders', { username:req.body.username });
  })
  res.status(200).json({msg:'Reminder added'});
});

router.post('/getReminders', function(req, res, next) {
  console.log("In get_reminders");
  console.log(req.body.username);
  var db = req.db;
  var reminderCollection = db.get("reminders");
  reminderCollection.find({'username':req.body.username}, {}, function(err, reminders){
    console.log(reminders)
    if(reminders && reminders.length !== 0){
      console.log('reminders for this user exist');
      console.log(reminders)
      res.status(200).send(reminders);
    }
    else{
      console.log('no reminders for this user');
      res.status(200).send({msg:'no reminders'});
    }
  })
});

router.post('/getOneReminder', function(req, res, next) {
  console.log("In get_reminders");
  console.log(req.body.id);
  var db = req.db;
  var reminderCollection = db.get("reminders");
  reminderCollection.find({'_id':req.body.id}, {}, function(err, reminders){
      res.status(200).send(reminders);
  })
});

router.post('/getOneAlarm', function(req, res, next) {
  console.log("In get_one_alarm");
  console.log(req.body.id);
  var db = req.db;
  var alarmCollection = db.get("alarms");
  alarmCollection.find({'_id':req.body.id}, {}, function(err, alarm){
      res.status(200).send(alarm);
  })
});

router.post('/deleteReminder', function(req, res, next) {
  console.log("In del_reminders");
  console.log(req.body.id);
  var db = req.db;
  var reminderCollection = db.get("reminders");
  reminderCollection.remove( { "_id" : req.body.id } )
  res.json({msg:'reminder removed'});
  req.io.emit('reminders', { _id:req.body.id });
});

router.post('/deleteAlarm', function(req, res, next) {
  console.log("In del_alarms");
  console.log(req.body.id);
  var db = req.db;
  var alarmCollection = db.get("alarms");
  alarmCollection.remove( { "_id" : req.body.id } )
  res.json({msg:'alarm removed'});
});


router.post('/editReminder', function(req, res, next) {
  console.log("In edit_reminder");
  console.log(req.body.id);
  var db = req.db;
  var reminderCollection = db.get("reminders");
  reminderCollection.update(
         { _id: req.body.id },{
           $set: {
              description:req.body.description,
              date: req.body.date
           }
          }
         )
  req.io.emit('reminders', { _id:req.body.id });
  res.status(200).send({msg:"reminder updated"});
});

router.post('/editAlarm', function(req, res, next) {
  console.log("In edit_alarm");
  console.log(req.body.id);
  var db = req.db;
  var reminderCollection = db.get("alarms");
  reminderCollection.update(
         { _id: req.body.id },{
           $set: {
              day:req.body.day,
              time: req.body.time,
              dayNumber:req.body.dayNumber,
              hours: req.body.hours,
              minutes: req.body.minutes,
           }
          }
         )
  res.status(200).send({msg:"alarm updated"});
});


module.exports = router;