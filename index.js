var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var cors = require('cors');
var debug = require('debug')('learn:server');
var AES_KEY = '6fnhkgo71s0caeqma6ojjftu4n1m1d85';
var crypto = require("crypto-js");
var session = require('express-session')({
	secret: "@#$%^&*(LKJLKSALYUQWEMJQWN<MNQDKLJHSALKJDHAUISDIUDYSASHDAM<SD",
	saveUninitialized: false,
	resave: false
});
var mongoclient = 'mongodb://localhost:27017/demo_api_db'
mongoose.connect(mongoclient, { useNewUrlParser: true });
var route = require('./routes/route');
const port = 3002;
var app = express();
app.use(cors())
app.use(session);

app.set('port', port);
var server = http.createServer(app, session);

server.listen(port);
server.on('error', function (error) {
	if (error.syscall != 'listen') {
		throw error;
	}
	var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

	switch (error.code) {
		case 'EACCES':
			console.error(bind + 'require elevated privileges.');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use.');
			process.exit(1);
			break;
		default:
			throw error;
	}
});
server.on('listening', function () {
	var addr = server.address();
	var bind = typeof addr === 'string' ? 'Pipe ' + addr : 'Port ' + addr.port;
	console.log('Listening on port ' + bind);
	// mqttServ.on('ready', function () {
	// 	mqttServ.authenticate = authenticate;
	// 	mqttServ.authorizePublish = authorizePublish;
	// 	mqttServ.authorizeSubscribe = authorizeSubscribe;
	// })
});


mongoose.connection.once('open', function () {

	console.log('Database connection made successfully.');
	app.use('/uploads/', express.static(path.join(__dirname, 'uploads')));
	app.use(cors());
	// app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	
	//app.use(cookieParser());

	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.static(path.join(__dirname, 'data')));
	app.use("/public", express.static(__dirname + "/public/"));
	app.use(express.static('contarcterWeb'));
	app.post('/*', route);
	app.get('/*', route);
	app.get('*', (req, res) => {
		res.send(path.join(__dirname, 'contarcterWeb'));
	});
	app.post('*', (req, res) => {
		res.send(path.join(__dirname, 'contarcterWeb'));
	});
	app.use(function (req, res, next) {
	});

	if (app.get('env') == 'development') {
		app.use(function (res, req, next) {
			res.status(err.status || 500);
			res.rander('page_404.html');
		});
	}

	app.use(function (res, req, next) {
		console.log(err);
		res.status(err.status || 500);
		// res.json({asd:'asd1'})
		res.rander('page_404.html');
		next(err);
	});

	app.use(function (error, res, req, next) {
		// req.json({error:error})
		// req.status(500).json({ error: error.message })
		// next(err);
	});

});
mongoose.connection.on('error', function (err) {
	console.log('Database connection dropped, due to ' + err);
	// proecss.exit();
});