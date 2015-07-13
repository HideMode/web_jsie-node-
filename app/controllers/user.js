var mongoose = require('mongoose');
var config = {
	//mail: require('./config/mail')
	credentials: require('../../config/credentials')
};
var nodemailer = require('nodemailer');
var Account = require('../models/Account')(config.credentials, mongoose, nodemailer);
// var Feedback = require('../models/Feedback')(mongoose);
// var Feedback = Feedback.Feedback;
var formidable = require('formidable'),
	util = require('util'),
	fs = require('fs'),
	path = require('path');


exports.settings = function(req, res) {
	var type = req.params.type;
	switch (type) {
		case 'avatar':
			res.render('user/settings/avatar', {
				title: "头像设置"
			})
			break;
		case 'email':
			res.render('user/settings/profile', {
				title: "个人资料"
			})
			break;
		case 'password':
			res.render('user/settings/password', {
				title: "修改密码"
			})
			break;
			// case 'profile':
			// 	res.render('user/settings/profile', {
			// 		title: "个人资料"
			// 	})
			// 	break;
		case 'feedback':
			res.render('user/settings/feedback', {
				title: "意见反馈"
			});
			break;
		default:
			res.render('user/settings/avatar', {
				title: "头像设置"
			})
	}
}
exports.login = function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	Account.login(email, password, function(account) {
		if (!account) {
			req.session.loggedIn = false;
			res.json({
				success: 0
			})
			return;
		}
		req.session.avatar = account.profile.avatar;
		req.session.loggedIn = true;
		req.session.role = account.role; //0 1
		req.session.accountId = account.id;
		req.session.nickname = account.nickname;
		res.json({
			success: 1
		})
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
			req.session.avatar = account.profile.avatar;
			res.json({
				success: 1
			})
		} else {
			res.json({
				success: 0
			})
		}
	});
}

// exports.setprofile = function(req, res) {
// 	var data = req.body;
// 	console.log(data);
// 	Account.Account.find({
// 			_id: req.session.accountId
// 		},
// 		function(err, account) {
// 			console.log(account);
// 			if ('' == data.nickname) {
// 				return;
// 			}
// 			// if (data.nickname != req.session.nickname) {
// 			// 	account.nickname = data.nickname
// 			// }
// 			// if (data.signature != '') {
// 			// 	//account.profile.push({signature:data.signature})
// 			// }
// 			account.save(function(err) {
// 				res.json({
// 					success: 1
// 				})
// 			})

// 		})
// }
exports.uploadAvatar = function(req, res) {
	var form = new formidable.IncomingForm();
	form.uploadDir = "public/uploads/image/avatar";
	form.keepExtensions = true;
	form.on('aborted', function() {});
	form.on("end", function() {

	});
	form.on('file', function(name, file) {
		var mimetype = file.type;
		if (/^image/.test(mimetype)) {
			console.log("上传成功");
		} else {
			fs.unlink('public' + file.path, function() {
				console.log("格式不匹配");
			});
		}
	});
	form.parse(req, function(err, fields, files) {
		if (err) {
			console.log(err);
			return;
		}
		var path = files.avatar.path.substring(files.avatar.path.lastIndexOf('\\') + 1);
		Account.Account.findOne({
				_id: req.session.accountId
			},
			'profile',
			function(err, account) {
				if (err) {
					console.log(err);
					return;
				}
				var old_image_path = account.profile.avatar;
				if (old_image_path != 'avatar.jpg') {
					fs.unlink('public\\uploads\\image\\avatar\\' + old_image_path, function() {
						console.log("删除旧头像");
					});
				}
				account.profile.avatar = path;
				account.save(function(err) {
					if (err) {
						console.log(err);
						return;
					}
					req.session.avatar = path;
					res.redirect('/settings/avatar')
				})
			})
	});
}

exports.changePwd = function(req, res) {
	var data = req.body;
	if(''==data.oldpassword || ''== data.newpassword){
		return;
	}
	if(data.newpassword.length < 6) return;
	Account.changePassword(req.session.accountId, data.oldpassword, data.newpassword,
		function(account) {
			if(account){
				res.json({
					success: 1
				})
			}else{
				res.json({
					succees: 0
				})
			}
		})
}

exports.getInfo = function(req, res) {
	var accountId = req.session.accountId;
	Account.Account.findOne({
			_id: accountId
		},
		'email nickname createTime role profile',
		function(err, user) {
			if (err) {
				console.log(err);
				return;
			}
			res.json(user)
		})
}
exports.checkname = function(req, res) {
	var nickname = req.body.nickname;
	Account.findByString(nickname, function(dup) {
		if (dup) { //重复
			res.json({
				success: 0
			});
		} else {
			res.json({
				success: 1
			})
		}
	});
}

exports.logout = function(req, res) {
	delete res.locals;
	req.session.destroy(function(err) {
		console.log(err);
	});
	res.redirect('/');
}

//admin  operation
exports.userlist = function(req, res) {
	Account.Account.count(function(err, count) {
		if (err) {
			console.log(err);
			return;
		}
		res.render('admin/userlist', {
			title: "用户列表",
			count: count
		})
	})
}

// user paination
exports.userPagination = function(req, res) {
	var page = req.query.page;
	Account.Account.count(function(err, count) {
		var maxNum = 20; //分页 20 条记录
		var maxPage = Math.ceil(count / maxNum);
		if (page < 1) {
			page = 1 //跳至最后一页
		} else if (page > maxPage) {
			page = maxPage //跳至第一页
		}
		Account.Account.find({})
			.select('email nickname role createTime')
			.skip((page - 1) * maxNum)
			.limit(maxNum)
			.exec(function(err, users) {
				if (err) {
					console.log(err);
					return;
				}
				res.json(users);
			})
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
	} else {
		return next();
	}
	res.redirect(303, '/unauthorized');
}