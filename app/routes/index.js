'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var bodyParser = require('body-parser');
module.exports = function (app, passport) {
app.use(bodyParser.urlencoded({ extended: true })); 
	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			
			res.send(JSON.stringify({ error: "you are not logged in." }))
		}
	}

	var pollHandler = new PollHandler();
	var clickHandler = new ClickHandler();

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});
		
		app.route('/new-poll')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/new-poll.html');
		});
		// vote on polls route
		app.route('/vote/api')
		.post(function (req, res) {
			
			var poll = '/polls/' + req.body.pollID;
			console.log("ppoll " + poll);
			pollHandler.vote(req.body);
			res.redirect(poll);
		});
		
		app.route('/new-poll/api')
		.post(isLoggedIn, function (req, res) {
			console.log(req.body);
			var x = req.body;
			x['github'] = req.user;
			console.log(x);
			console.log(req.user)
			pollHandler.addPoll(x);
			res.redirect('/new-poll');
			//res.end(JSON.stringify(req.body))
			//res.end("Your file size is " + req.body["poll-options"] + " bytes.");
		});
		/*.get(isLoggedIn, function (req, res) {
			 var pollName = req.param('poll-name');
			 var pollOptions = req.param('poll-options').split(',');
			var x = req;
			console.log(pollName);
			res.send(pollOptions);
		});*/

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
		
	//get invididual polls display client
	app.route('/polls/:id')
		.get(function (req, res) {
			res.sendFile(path + '/public/polls.html');
		});
		
		//get invididual polls server
	app.route('/poll/:id')
		.get(pollHandler.getPoll)
		

	app.route('/api/:id/clicks')
		.get(pollHandler.getPolls)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
	app.route('/testing')
	.get(pollHandler.getDrop)
};
