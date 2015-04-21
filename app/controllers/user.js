var mongoose = require('mongoose');
var config = {
	//mail: require('./config/mail')
	credentials: require('../../config/credentials')
};
var nodemailer = require('nodemailer');
var Account = require('../models/Account')(config.credentials, mongoose, nodemailer);

//个人主页
exports.account = function(req, res) {
	res.render('user/account.jade', {
		title: "账号",
		account: {
			nickname: res.locals.nickname,
			signature: '什么都没留下!',
			class: '12网工',
			status: {
				1: {
					time: '今天',
					type: "关注了这个问题",
					title: 'dsfds'
				},
				2: {
					time: '1天前',
					type: '回答了这个问题',
					title: "ddf"
				}
			}
		}
	});
}
exports.settings = function(req, res) {
	res.render('user/settings.jade', {
		title: "设置"
	});
}
exports.login = function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	Account.login(email, password, function(account) {
		if (!account) {
			req.session.loggedIn = false;
			res.sendStatus(401);
			return;
		}
		req.session.loggedIn = true;
		req.session.role = account.role; //0 1
		req.session.accountId = account.id;
		req.session.nickname = account.nickname;
		res.sendStatus(200);
	});
}

exports.register = function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	var nickname = req.body.nickname;

	if (null === email || null === password || null === nickname) {
		res.sendStatus(400);
		return;
	}
	Account.register(email, password, nickname, function(account) {
		if (account) {
			req.session.loggedIn = true;
			req.session.role = account.role;
			req.session.accountId = account.id;
			req.session.nickname = account.nickname;
			res.sendStatus(200);
		} else {
			res.sendStatus(400);
		}
	});
}

exports.checkname = function(req, res) {
	var nickname = req.body.nickname;
	Account.findByString(nickname, function(dup) {
		if (dup) { //重复
			res.send("failed");
		} else {
			res.send("ok");
		}
	});
}

exports.logout = function(req, res) {
	delete res.locals;
	req.session.destroy(function(err) {
		console.log('err ' + err);
	});
	res.redirect('/');
}

//admin  operation
exports.userlist = function(req, res) {
	Account.Account.fetch(function(err, users) {
		res.render('admin/userlist', {
			title: "用户列表",
			users: users
		});
	});
}
exports.isLogged = function(req, res, next) {
	if (req.session === undefined || !req.session.loggedIn) {
		res.redirect(303, '/');
	} else {
		return next();
	}
}
exports.allowRole = function(req, res, next) {
	if (req.session !== undefined && req.session.loggedIn) {
		var role = req.session.role;
		if (role && role >= 11) {
			delete res.locals;
			req.session.destroy(function(err) {
				if (err)
					console.log(err);
			});
		}
	} else {
		req.session.loggedIn = false;
	}
	return next();
}

exports.studentOnly = function(req, res, next) {
	var role = req.session.role;
	if (role && role >= 11) {
		delete res.locals;
		req.session.destroy(function(err) {
			if (err)
				console.log(err);
		});
		req.session.loggedIn = false;
	}
	if (role && role <= 1) return next();
	res.redirect(303, '/unauthorized');
}