var mongoose = require('mongoose');
var Admin = require('../models/Admin')(mongoose);

exports.login = function(req, res) {
	res.render('admin/login', {
		title: "登陆"
	})
}


//post
exports.doLogin = function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	Admin.login(username, password, function(admin) {
		if (admin) {
			req.session.role = admin.role;
			req.session.loggedIn = true;
			req.session.username = admin.username;
			res.json({
				accessGranted: true
			});
		} else {
			res.json({
				accessGranted: false,
				errors: "账号或密码不正确"
			});
		}
	})
}
exports.adminlist = function(req, res) {
	Admin.Admin.fetch(function(err, admins) {
		if (err) {
			console.log(err);
			return;
		}
		res.render('admin/adminlist', {
			title: "管理员列表",
			admins: admins
		})
	})
}
exports.register = function(req, res) {
	var password = req.body.password;
	var username = req.body.username;
	var role = req.body.role;
	if (null === username || null === password) {
		return;
	}
	Admin.register(username, password, role, function(admin) {
		if (admin) {
			console.log("管理员账号创建成功");
		} else {
			console.log("管理员账号创建失败");
		}
		res.redirect('/admin/adminlist');
	});
}

exports.logout = function(req, res) {
	delete res.locals;
	req.session.destroy(function(err) {
		console.log('err ' + err);
	});
	res.redirect('/admin/login');
}
exports.loggedIn = function(req, res, next) {
	if (req.session === undefined) {
		return next();
	} else if (req.session.loggedIn) {
		if (req.session.role >= 11) {
			res.redirect('/admin');
		} else {
			return next();
		}
	} else {
		return next();
	}
}
exports.adminOnly = function(req, res, next) {
	if (req.session === undefined) {
		res.redirect('/admin/login');
		next('route');
	} else if (req.session.loggedIn) {
		var role = req.session.role;
		if (role && role >= 11) return next();
		res.redirect('/admin/login');
		next('route');
	} else {
		res.redirect('/admin/login');
		next('route');
	}
}