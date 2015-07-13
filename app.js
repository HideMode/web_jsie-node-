//Node.js应用的入口点

var express = require("express"),
	app = express(),
	bodyParser = require('body-parser'), //req.body by post 
	//multer = require('multer'), //multipart/form-data
	nodemailer = require('nodemailer'),
	mongoose = require('mongoose'),
	cookie = require('cookie-parser'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	path = require('path'),
	FileStreamRotator = require('file-stream-rotator'),
	fs = require('fs'),
	config = {
		//mail: require('./config/mail')
		credentials: require('./config/credentials')
	},
	ueditor = require('./config/ueditor/ueditor'),
	Db = require('./config/Db')(mongoose),
	port = process.env.PORT || 8080;
app.set('views', './app/views');
app.set("view engine", "jade");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
}));

// log
var logDirectory = __dirname + '/log'
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
var accessLogStream = FileStreamRotator.getStream({
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false
})
app.use(require('morgan')('combined', {stream: accessLogStream}))


/**
 * set session
 */
app.use(session({
	secret: 'HideMode',
	resave: false,
	saveUninitialized: true,
	cookie: {
		path: '/',
		httpOnly: true,
		secure: false,
		maxAge: null
	},
	store: new MongoStore({
		url: 'mongodb://localhost/userSession'
	})
}));

// 用户富文本编辑器预留接口
app.use('/static/ueditor/user/ue', ueditor({ // url /static/uediter/ue
	configFile: '/static/ueditor/nodejs/user.config.json',
	mode: 'local', //本地存储填写local
	staticPath: path.join(__dirname, 'public'), //一般固定的写法，静态资源的目录，如果是bcs，可以不填
	dynamicPath: function(req) {
			var action = req.query.action;
			switch (action) {
				case "uploadimage":
					break;
				case "uploadvideo":
					break;
				case "uploadfile":
					break;
				default:
					return '/uploads/temp'
			}
		} 
}));
app.use('/static/ueditor/ue', ueditor({ // url /static/uediter/ue
	configFile: '/static/ueditor/nodejs/config.json',
	mode: 'local', //本地存储填写local
	staticPath: path.join(__dirname, 'public'), //一般固定的写法，静态资源的目录，如果是bcs，可以不填
	dynamicPath: function(req) {
			var action = req.query.action;
			switch (action) {
				case "uploadimage":
					return '/uploads/image/view';
					break;
				case "uploadvideo":
					return '/uploads/video';
					break;
				case "uploadfile":
					return '/uploads/file';
					break;
				case "listimage":
					return '/uploads/image/view';
					break;
				case "listfile":
					return '/uploads/file';
					break;
				default:
					return '/uploads/temp'
			}
		} 
}));
app.locals.zone = "Asia/Shanghai"
app.locals.moment = require('moment-timezone')
require('./config/routes')(app)

app.listen(port);
console.log('http://localhost:' + port);
