var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Discuss = require('../app/controllers/discuss')
var Category = require('../app/controllers/category')
var Course = require('../app/controllers/course')
var Admin = require('../app/controllers/admin')
var formidable = require('formidable'),
	util = require('util'),
	fs = require('fs'),
	path = require('path');
module.exports = function(app) {
	app.use(function(req, res, next) {
		if (req.session !== undefined && req.session.loggedIn) {
			res.locals.nickname = req.session.nickname;
			res.locals.isLogined = true;
		} else {
			req.session.loggedIn = false;
		}
		return next();
	})
	app.get('/', User.allowRole, Index.index);

	app.post('/login', User.allowRole, User.login);

	app.post('/register', User.allowRole, User.register);

	//验证用户名是否注册
	app.post('/checkname', User.allowRole, User.checkname);
	app.get('/unauthorized', User.allowRole, function(req, res) {
		res.render('unauthorized.jade');
	});
	app.get('/course', User.allowRole, Course.course);
	app.get('/course/:courseId', User.allowRole, Course.courseWithParam)
	app.get('/discuss', User.allowRole, Discuss.discuss);
	app.get('/account', User.allowRole, User.isLogged, User.studentOnly, User.account);
	app.get('/settings', User.allowRole, User.isLogged, User.studentOnly, User.settings);
	app.get('/account/authenticated', function(req, res) {
		if (req.session.loggedIn) { //express-session middleware
			res.sendStatus(200);
		} else {
			//unauthorized
			res.sendStatus(400);
		}
	});

	app.get('/logout', User.allowRole, User.studentOnly, User.logout);



	/**
	 * admin
	 */

	app.use('/admin', function(req, res, next) {
		if (req.session === undefined) {
			delete res.locals;
			res.locals.isLogined = false;
		} else if (req.session.loggedIn) {
			// for user
			res.locals.isLogined = true;
			if (req.session.role >= 11) { // for admin
				//res.locals.isLogged = true;
				res.locals.nickname = req.session.username;
				res.locals.role = req.session.role;
			} else {
				delete res.locals;
			}
		} else {
			delete res.locals;
		}
		return next();
	});

	app.get('/admin/login', Admin.loggedIn, Admin.login);
	app.post('/admin/login', Admin.loggedIn, Admin.doLogin);


	app.post('/getCate', Admin.adminOnly, Category.getCate)
	app.get('/admin', Admin.adminOnly, function(req, res) {
		res.render('admin/index', {
			title: "后台管理"
		});
	});
	app.get('/admin/userlist', Admin.adminOnly, User.userlist);

	app.get('/admin/adminlist', Admin.adminOnly, Admin.adminlist)
	app.get('/admin/category', Admin.adminOnly, Category.category);
	app.post('/admin/addcategory', Admin.adminOnly, Category.addcategory);
	app.post('/admin/addsubcategory', Admin.adminOnly, Category.addsubcategory);
	app.get('/admin/courselist', Admin.adminOnly, Course.courselist)
	app.get('/admin/newcourse', Admin.adminOnly, Course.new);
	app.post('/admin/newcourse', Admin.adminOnly, Course.newcourse)

	app.get('/admin/course/:courseId', Admin.adminOnly, Course.admincourse);
	app.post('/admin/addchapter', Admin.adminOnly, Course.addchapter);
	app.post('/admin/courseedit', Admin.adminOnly, Course.courseedit);

	app.post('/admin/detail', Admin.adminOnly, Course.detail);
	app.post('/admin/register', Admin.adminOnly, Admin.register);
	app.get('/admin/logout', Admin.adminOnly, Admin.logout);
}