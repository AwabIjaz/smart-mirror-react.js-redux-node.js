var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary')
var fs = require('fs');
var User = require('../models/user');

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

var nodemailer = require('nodemailer');


cloudinary.config({
	cloud_name: 'dgq7bff58',
	api_key: '859866388255326',
	api_secret: 'sIaIoVREaUl0BLC036CZshoSs_o'
});


var multer = require('multer')
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, '/app/routes/python/face/')
	},
	filename: function (req, file, cb) {
		cb(null, 'my.png')
	}
})
var upload = multer({ storage: storage })

router.post('/upload', upload.single('file', 12), function (req, res, next) {
	console.log('inside upload post');
	tags = req.body.username;
	const spawn = require("child_process").spawn;
	var dir = "/app/routes/" + "python/face/face_check.py";
	var img = "/app/routes/" + "python/face/my.png";
	console.log(dir);
	const pythonProcess = spawn('python', [dir, "--image", img]);
	console.log('here')
	pythonProcess.stdout.on('data', (data) => {
		console.log('here 2')
		var sending = data.toString('utf8');
		sending = sending.trim()
		if (sending === 'face detected') {
			console.log('face detected')
			cloudinary.v2.uploader.upload(req.file.path, { tags: tags, width: '640' }, function (error, result) {
			})
			res.status(200).send('Image Successfully Uploaded');

			//training
			var dir = "/app/routes/" + "python/face/new_encode.py";
			const spawn = require("child_process").spawn;
			const pythonProcess = spawn('python', [dir]);

		}
		else if (sending === 'multiple faces detected') {
			res.status(200).send('Multiple person detected, upload an image with a single person');
		}
		else {
			console.log('face not detected');
			res.status(200).send('Face not detected, upload an image with a face');
		}
	})
});


//train pickle file
router.get('/train', function (req, res, next) {
	console.log('inside train');
	var dir = "/app/routes/" + "python/face/new_encode.py";
	console.log(dir);
	const spawn = require("child_process").spawn;
	const pythonProcess = spawn('python', [dir]);
	console.log('here');
	pythonProcess.stdout.on('data', (data) => {
		var sending = data.toString('utf8');
		sending = sending.trim()
		console.log('data = ' + sending)
		res.status(200).json(sending);
	})
});

router.post('/register', function (req, res, next) {
	console.log("In register user");
	var nameRequired = 'Name required';
	var emailRequired = 'Email required';
	var emailInvalid = 'Invalid email';
	var usernameRequired = 'Username required';
	var passwordRequired = 'Password required';
	var passwordSame = 'Both passwords must be same';
	var uniqueUsername = 'Username already exists';

	req.checkBody('name', nameRequired).notEmpty();
	req.checkBody('email', emailRequired).notEmpty();
	req.checkBody('email', emailInvalid).isEmail();
	req.checkBody('password', passwordRequired).notEmpty();
	req.checkBody('password2', passwordSame).equals(req.body.password);
	req.checkBody('username', 'Username is required').notEmpty();

	var errors = req.validationErrors();
	console.log('here oho')
	if (errors) {
		console.log(errors);
		res.status(200).send(errors);
	}
	else {
		var newUser = new User(req.body);
		User.createUser(newUser, function (err, user) {

			if (err) {
				console.log('hehe');
				console.log(err);

				var msgs = {
					msg: 'Username/Email have to be unique'
				}
				var errors = [msgs];
				res.status(200).send(errors);
			}
			else {
				res.status(200).send({ msg: 'success' });
			}
		});
	}
});

router.post('/setting', function (req, res, next) {
	console.log("In setting");
	console.log(req.body);

	var db = req.db;

	var widgetCollection = db.get("widgets");

	widgetCollection.find({ username: req.body.username }, {}, function (err, widgets) {
		if (widgets && widgets.length !== 0) {
			console.log('settings for this user exist');
			widgetCollection.update(
				{ username: req.body.username },
				{
					username: req.body.username,
					w1: req.body.w1,
					w2: req.body.w2,
					w3: req.body.w3,
					w4: req.body.w4
				})
				.then(() => {
					res.status(200).send('Your setting has been modified');
					req.io.emit('setting');
				})
		}
		else {
			console.log('creating settings for this user');
			widgetCollection.insert({
				username: req.body.username,
				w1: req.body.w1,
				w2: req.body.w2,
				w3: req.body.w3,
				w4: req.body.w4
			}).then(() => {
				res.status(200).send('Your setting has been created');
				req.io.emit('setting');
			})
		}
	})
});


router.post('/login', passport.authenticate('local', { failureRedirect: '/users/fail' }), function (req, res, next) {
	console.log(req.user.name);

	var user = {
		name: req.user.name,
		username: req.user.username,
		email: req.user.email,
		status: 'success'
	};
	console.log(user);
	res.status(200).send(user);
});

router.get('/fail', function (req, res, next) {
	var user = {
		status: 'fail'
	}
	console.log('fail');
	res.status(200).send(user);
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.findOne({ username: username }, function (err, user) {
			if (err) { return done(err); }
			if (!user) {
				return done(null, false);
			}
			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				}
				else {
					return done(null, false);
				}
			});
		});
	}
));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/reset', function (req, res, next) {
	console.log('inside reset');
	console.log(req.body);
	var verifying_str = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 5; i++) {
		verifying_str += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	console.log(verifying_str);
	var db = req.db;
	var userCollection = db.get('smartusers');
	userCollection.update({ email: req.body.email }, { $set: { forgotPassToken: verifying_str } }, function (err, writeResult) {
		console.log(writeResult);
		if (writeResult.nModified === 1) {
			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'mhamza2797@gmail.com',
					pass: 'proton27'
				}
			});
			var mailOptions = {
				from: 'mhamza2797@gmail.com',
				to: req.body.email,
				subject: 'Reset password',
				text: 'Use this link to reset your password: ' + 'http://sm-fyp.herokuapp.com/changePassword/' + verifying_str
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent: ' + info.response);
					res.status(200).send({ msg: "check mail" });
				}
			});
		}
		else {
			res.status(200).send({ msg: "mail doesnt exist" });
		}
	})
});

router.post('/verify', function (req, res, next) {
	console.log('in verify');
	var db = req.db;
	var userCollection = db.get('smartusers');
	userCollection.find({ forgotPassToken: req.body.token }, function (err, users) {
		console.log(users);
		if(users[0] && users){
			console.log('in');
			res.status(200).send({email:users[0].email})	
		}
		else{
			res.status(401).send({msg:"unauthorized"})		
		}
	})
});

router.post('/updatePassword', function(req,res){
	console.log(req.body);

	var passwordRequired = 'Password required';
	var passwordSame = 'Both passwords must be same';

	req.checkBody('password', passwordRequired).notEmpty();
	req.checkBody('password2', passwordSame).equals(req.body.password);

	var errors = req.validationErrors();
	if (errors) {
		console.log(errors);
		res.status(200).send(errors);
	}
	else {
		var user = {
			email: req.body.email,
			password: req.body.password
		}
		User.changePassword(user, function (err, user) {
			console.log('back');
			console.log(err)
			console.log(user)
			if (err) {
				console.log('hehe');
				console.log(err);
			}
			else {
				res.status(200).send({ msg: 'success' });
			}
		});
	}
});

module.exports = router;
