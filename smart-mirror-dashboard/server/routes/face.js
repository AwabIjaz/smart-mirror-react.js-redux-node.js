var express = require('express');
var router = express.Router();

var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/app/routes/python/face')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var upload = multer({ storage: storage });

//recognize from live pic (use this on rpi)
router.post('/', upload.single('file', 12),  function(req, res, next) {
	console.log('inside recognize experiment');
	var dir = "/app/routes/" + "python/face/recognize_faces_image.py";
	var img = "/app/routes/" + "python/face/my.png";
	console.log(dir);
	const spawn = require("child_process").spawn;
	const pythonProcess = spawn('python',[dir, "--image" , img]);
	console.log('here');
	pythonProcess.stdout.on('data', (data) => {
		var sending = data.toString('utf8');
		sending = sending.trim()
		console.log(sending);
		res.status(200).json(sending);
	});

});

//nothing much really
router.get('/test',  function(req, res, next) {
	console.log('inside test experiment');
	var dir = "/app/routes/" + "python/face/creating/recognize_faces_image.py";
	var enc = "/app/routes/" + "python/face/creating/encodings.pickle";
	var img = "/app/routes/" + "python/face/creating/my.png";
	console.log(dir);
	const spawn = require("child_process").spawn;
	const pythonProcess = spawn('python',[dir, "--encodings", enc, "--image" , img]);
	console.log('here');
	pythonProcess.stdout.on('data', (data) => {
		var sending = data.toString('utf8');
		sending = sending.trim()
		console.log(sending);
		res.json(sending);
	});

});


module.exports = router;
