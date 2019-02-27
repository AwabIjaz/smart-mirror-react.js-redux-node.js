var express = require('express');
var router = express.Router();

router.get('/recognize', function(req, res, next) {
	console.log('inside face experiment');
	const spawn = require("child_process").spawn;
	const pythonProcess = spawn('python',["C:\\Users\\AWAB\\Desktop\\face\\recognize_faces_image_pic.py", "-e", "C:\\Users\\AWAB\\Desktop\\face\\encodings.pickle"]);
	pythonProcess.stdout.on('data', (data) => {
    	res.send(data);
	});	
});


module.exports = router;