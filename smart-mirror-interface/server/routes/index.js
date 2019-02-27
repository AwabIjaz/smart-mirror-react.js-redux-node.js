var express = require('express');
var router = express.Router();
const request = require('request');
var myGoogleNews = require('my-google-news');
myGoogleNews.resultsPerPage = 10; // max 100
var async = require('async');

router.get('/weather', function(req, res, next) {
	request('http://api.openweathermap.org/data/2.5/weather?q=lahore,pk&appid=' + process.env.WEATHER_API_KEY, (err, response) => {
		if (err) { 
			return console.log(err);
		}
		res.send(response.body);
	});
});

router.get('/forecast', function(req, res, next) {
	request('http://api.openweathermap.org/data/2.5/forecast/daily?q=lahore,pk&cnt=5&appid=' + process.env.WEATHER_API_KEY, (err, response) => {
		if (err) { 
			return console.log(err);
		}
		res.send(response.body);
	});
});


router.get('/news', function(req, res, next) {
	var nextCounter = 0;
	var googleQuery="pakistan"; //search Query
	myGoogleNews(googleQuery, function (err, reso){
		if (err) console.error(err)
		res.send(reso.links);
	  //number of pages if you want more than one page
	  /*if (nextCounter < 4) {
		nextCounter += 1
		if (res.next) res.next()
	  }*/
	});
});


//rename this router you shit!
router.get('/voiceApi', function(req, res, next) {
	console.log('inside voice api server');
	var dir = __dirname + "\\python\\voice.py";
	console.log(dir);
	console.log("");
	const spawn = require("child_process").spawn;
	const pythonProcess = spawn('python',[dir]);
	pythonProcess.stdout.on('data', (data) => {
    	res.send(data);
	});	
});

router.get('/wakeWord', function(req, res, next) {
	console.log('inside wakeword server');
	const spawn = require("child_process").spawn;
	const pythonProcess = spawn('python',["E:\\Porcupine-1.3\\demo\\python\\porcupine_demo.py", "--keyword_file_paths", "E:\\Porcupine-1.3\\smartmirror_windows.ppn"]);
	pythonProcess.stdout.on('data', (data) => {
    	res.send(data);
	});	
});

//rename this router you shit!
router.get('/exp', function(req, res, next){
	console.log('inside voice experiment');
	var dir = __dirname + "\\python\\finalDraft.py";
	const spawn = require("child_process").spawn;
	const pythonProcess = spawn('python',[dir]);
	pythonProcess.stdout.on('data', (data) => {
		var resq = data.toString('utf8').split(/\r?\n/);
    	resq.length = 4;
    	console.log(resq);
		res.send(resq);
	});
});
module.exports = router;