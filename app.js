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
	ueditor = require('ueditor-nodejs'),
	path = require('path'),
	config = {
		//mail: require('./config/mail')
		credentials: require('./config/credentials')
	},
	Db = require('./models/Db')(mongoose),
	// models = {
	// 	Account: require('./models/Account')(config.credentials, mongoose, nodemailer),
	// 	Course: require('./models/Course')(mongoose),
	// 	Db: require('./models/Db')(mongoose),
	// 	Admin: require('./models/Admin')(mongoose),
	// 	Video: require('./models/Video')(mongoose),
	// 	Category: require('./models/Category')(mongoose)
	// },
	port = process.env.PORT || 8080;
app.set('views', './app/views');
app.set("view engine", "jade");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
}));

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

app.use('/ueditor/ue', ueditor({ //这里的/ueditor/ue是因为文件件重命名为了ueditor,如果没改名，那么应该是/ueditor版本号/ue
	configFile: '/ueditor/php/config.json', //如果下载的是jsp的，就填写/ueditor/jsp/config.json
	mode: 'local', //本地存储填写local
	staticPath: path.join(__dirname, 'public'), //一般固定的写法，静态资源的目录，如果是bcs，可以不填
	dynamicPath: function(req){
		console.log(req.query.action);
		var action = req.query.action;
		switch(action){
			case "uploadimage": return '/uploads/image'; break;
			case "uploadvideo": return '/uplodas/video'; break;
			case "uploadfile": return '/uplodas/file'; break;
			default: return '/uploads/temp'
		}
	}//'/uploads/temp/' //动态目录，以/开头，bcs填写buckect名字，开头没有/.路径可以根据req动态变化，可以是一个函数，function(req) { return '/xx'} req.query.action是请求的行为，uploadimage表示上传图片，具体查看config.json.
}));
app.locals.moment = require('moment');
//require("./routes/routes")(app, models);
require('./config/routes')(app)

app.listen(port);
console.log('http://localhost:' + port);