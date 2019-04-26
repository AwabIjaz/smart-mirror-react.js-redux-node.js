var express = require('express');
var router = express.Router();
const request = require('request');
var myGoogleNews = require('my-google-news');
myGoogleNews.resultsPerPage = 10; // max 100


router.get('/weather', function(req, res, next) {
	request('http://api.openweathermap.org/data/2.5/weather?q=lahore,pk&appid=' + process.env.WEATHER_API_KEY, (err, response) => {
		if (err) { 
			return console.log(err);
		}
		res.status(200).send(response.body);
	});
});

router.get('/forecast', function(req, res, next) {
	request('http://api.openweathermap.org/data/2.5/forecast/daily?q=lahore,pk&cnt=5&appid=' + process.env.WEATHER_API_KEY, (err, response) => {
		if (err) { 
			return console.log(err);
		}
		res.status(200).send(response.body);
	});
});

router.get('/news', function(req, res, next) {
	var nextCounter = 0;
	var googleQuery="pakistan"; //search Query
	myGoogleNews(googleQuery, function (err, reso){
		if (err) {
			console.error(err)
		}
		res.status(200).send(reso.links);
	  //number of pages if you want more than one page
	  /*if (nextCounter < 4) {
		nextCounter += 1
		if (res.next) res.next()
	  }*/
	});
});


router.get('/wakeWord', function(req, res, next) {
	console.log('inside wakeword server');
	const file = req.wake + "demo/python/porcupine_demo.py"
	const model = req.wake + "smartmirror_windows.ppn"

	const { spawn } = require("child_process");
	const pythonProcess = spawn('python',[file,"--keyword_file_paths" ,model]);
	pythonProcess.stdout.on('data', (data) => {
		console.log('was here');
		res.status(200).send(data);
	});
	/*pythonProcess.on('close', (code) => {
		if (code !== 0) {
			console.log(`process exited with code ${code}`);
			res.status(504).send('Service unavailable')	
		}
		else{
			console.log('wakeword pid = ' + pythonProcess.pid);
			pythonProcess.kill('SIGKILL');
		}
	});*/
});

router.get('/commands', function(req, res, next){
	console.log('inside voice commands');
	var file = req.dest + "finalDraft.py";
	const { spawn } = require("child_process");
	const pythonProcess = spawn('python',[file]);
	pythonProcess.stdout.on('data', (data) => {
		var resq = data.toString('utf8').split(/\r?\n/);
		console.log(resq)
		resq.length = 4;
		res.status(200).send(resq);
	});
	/*pythonProcess.on('close', (code) => {
		if (code !== 0) {
			console.log(`process exited with code ${code}`);
			res.send('Service unavailable')
		}
		else{
			console.log('commands pid = ' + pythonProcess.pid);
			pythonProcess.kill('SIGKILL');
		}
	});*/
});

//just to test if a script is spawning
router.get('/experimental', function(req, res, next){
	var exec = require('child_process').exec;
	console.log('in exp new');
	exec('python /home/pi/porc/sm/server/routes/python/finalDraft.py', function(error, stdout, stderr) {
		console.log('in here');
		console.log('stdout: ' + stdout);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
});

module.exports = router;