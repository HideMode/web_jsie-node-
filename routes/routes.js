module.exports = function(app, models) {
	var formidable = require('formidable'),
		util = require('util'),
		fs = require('fs'),
		path = require('path');
	var Category = models.Category.Category,
		Course = models.Course.Course;

	function studentOnly(req, res, next) {
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
		//游客 或者 注册账号浏览
	function allowRole(req, res, next) {
		if (req.session !== undefined && req.session.loggedIn) {
			var role = req.session.role;
			if (role && role >= 11) {
				delete res.locals;
				req.session.destroy(function(err) {
					if (err)
						console.log(err);
				});
			}
		}else{
			req.session.loggedIn = false;
		}
		return next();
	}

	function allow(roles) { //'student,teacher'
		var role = req.session.role;
		if (usr && roles.split(',').indexOf(role) !== -1) return next();
		res.redirect(303, '/unauthorized');
	}

	function isLogged(req, res, next) {
		if (req.session===undefined || !req.session.loggedIn) {
			res.redirect(303, '/');
		} else {
			return next();
		}
	}

	app.use(function(req, res, next) {
		if (req.session !== undefined && req.session.loggedIn) {
			res.locals.nickname = req.session.nickname;
			res.locals.isLogined = true;
		} else {
			req.session.loggedIn = false;
		}
		return next();
	})

	/**
	 * For user
	 */
	// app.use(['/', '/course', '/account', '/unauthorized', '/settings'], function(req, res, next) {
	// 	if (req.session === undefined) {
	// 		console.log("use operation");
	// 		req.session.isLogined = false
	// 	} else if (req.session.loggedIn) {
	// 		// for user
	// 		res.locals.isLogined = true;
	// 		if (req.session.role >= 11) { // for admin
	// 			//res.locals.isLogged = true;
	// 			delete res.locals
	// 			req.session.destroy(function(err) {
	// 				console.log(err);
	// 			})
	// 		}
	// 		// for user
	// 		else {
	// 			res.locals.nickname = req.session.nickname;
	// 		}
	// 	} else {
	// 		delete res.locals;
	// 		req.session.destroy(function(err) {
	// 			console.log(err);
	// 		})
	// 	}
	// 	return next();
	// });
	app.get('/', allowRole, function(req, res) {
		res.render('user/index.jade', {
			title: "主页"
		});
	});

	app.post('/login', allowRole, function(req, res) {
		var email = req.body.email;
		var password = req.body.password;
		models.Account.login(email, password, function(account) {
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
	});

	app.post('/register', allowRole, function(req, res) {
		var email = req.body.email;
		var password = req.body.password;
		var nickname = req.body.nickname;

		if (null === email || null === password || null === nickname) {
			res.sendStatus(400);
			return;
		}
		models.Account.register(email, password, nickname, function(account) {
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
	});

	//验证用户名是否注册
	app.post('/checkname', allowRole, function(req, res) {
		var nickname = req.body.nickname;
		models.Account.findByString(nickname, function(dup) {
			if (dup) { //重复
				res.send("failed");
			} else {
				res.send("ok");
			}
		});
	});
	app.get('/unauthorized', allowRole, function(req, res) {
		res.render('unauthorized.jade');
	});
	app.get('/course', allowRole, function(req, res) {
		Course.fetch(function(err, courses) {
			res.render('user/course.jade', {
				title: "课程",
				courses: courses
			});
		});

	});
	app.get('/course/:courseId', allowRole, function(req, res) {
		var courseId = req.params.courseId;
		Course.findOne({
				_id: courseId
			},
			'title details.title details.subs.title details.chapter',
			function(err, course) {
				if (err) {
					console.log(err);
				}
				res.render('user/coursedetail', {
					title: course.title,
					course: course
				});
			})
	})
	app.get('/discuss', allowRole, function(req, res) {
		res.render('user/discuss.jade', {
			title: "讨论"
		});
	});
	app.get('/account', allowRole, isLogged, studentOnly, function(req, res) {
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
	});
	app.get('/settings', allowRole, isLogged, studentOnly, function(req, res) {
		res.render('user/settings.jade', {
			title: "设置"
		});
	});
	app.get('/account/authenticated', function(req, res) {
		if (req.session.loggedIn) { //express-session middleware
			res.sendStatus(200);
		} else {
			//unauthorized
			res.sendStatus(400);
		}
	});

	app.get('/logout', allowRole, studentOnly, function(req, res) {
		delete res.locals;
		req.session.destroy(function(err) {
			console.log('err ' + err);
		});
		res.redirect('/');
	});



	/**
	 * admin
	 */
	function loggedIn(req, res, next) {
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

	function adminOnly(req, res, next) {
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
			} else {
				delete res.locals;
			}
		} else {
			delete res.locals;
		}
		return next();
	});

	app.get('/admin/login', loggedIn, function(req, res) {
		res.render('admin/login', {
			title: "登陆"
		})
	});
	app.post('/admin/login', loggedIn, function(req, res) {
		var username = req.body.username;
		var password = req.body.password;
		models.Admin.login(username, password, function(admin) {
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
	});


	app.post('/getCate', adminOnly, function(req, res) {
		var query = Category.find({})
		query.select('name subCategories._id subCategories.name')
		query.exec(function(err, categories) {
			if (err) {
				console.log(err);
				return;
			}
			res.json(categories);
		})
	})
	app.get('/admin', adminOnly, function(req, res) {
		res.render('admin/index', {
			title: "后台管理"
		});
	});
	app.get('/admin/userlist', adminOnly, function(req, res) {
		models.Account.Account.fetch(function(err, users) {
			res.render('admin/userlist', {
				title: "用户列表",
				users: users
			});
		});
	});

	app.get('/admin/adminlist', adminOnly, function(req, res) {
		models.Admin.Admin.fetch(function(err, admins) {
			if (err) {
				console.log(err);
				return;
			}
			res.render('admin/adminlist', {
				title: "管理员列表",
				admins: admins
			})
		})
	})
	app.get('/admin/category', adminOnly, function(req, res) {
		models.Category.Category.fetch(function(err, categories) {
			if (err) {
				console.log(err);
				return;
			}
			res.render('admin/category', {
				title: "分类信息",
				categories: categories
			})
		})
	});
	app.post('/admin/addcategory', adminOnly, function(req, res) {
		var categoryName = req.body.name;
		new models.Category.Category({
			name: categoryName
		}).save(function(err, category) {
			if (err) {
				console.log(err);
				return;
			}
			res.redirect('/admin/category');
		})
	});
	app.post('/admin/addsubcategory', adminOnly, function(req, res) {
		var categoryId = req.body.categoryId;
		var subName = req.body.subName
		models.Category.Category.findOne({
			_id: categoryId
		}, function(err, category) {
			if (err) {
				console.log(err);
				return;
			}
			category.subCategories.push({
				name: subName
			});
			category.save(function(err, category) {
				if (err) {
					console.log(err);
					return;
				}
				res.redirect('/admin/category');
			})
		})
	})
	app.get('/admin/courselist', adminOnly, function(req, res) {
		Category.find({}).populate({
				path: 'subCategories.courses',
				select: 'title author meta'
			})
			.exec(function(err, categories) {
				var courses = [];
				console.log(categories);
				categories.forEach(function(category) {
					category.subCategories.forEach(function(sub) {
						sub.courses.forEach(function(item) {
							courses.push(item);
						})
					})
				})
				console.log(courses);
				res.render('admin/courselist', {
					title: "课程列表",
					courses: courses
				})
			})
	})
	app.get('/admin/newcourse', adminOnly, function(req, res) {
		res.render('admin/newcourse', {
			title: '录入课程'
		});

	});
	app.post('/admin/newcourse', adminOnly, function(req, res) {
		var form = new formidable.IncomingForm();
		form.uploadDir = "public/uploads/poster";
		form.keepExtensions = true;
		form.on('aborted', function() {
			res.send("failed");
		});
		form.on("end", function() {
			res.send("ok");
		});
		form.on("progress", function(bytesRecieved, bytesExpected) {
			var uploadprogress = Math.ceil((bytesRecieved / bytesExpected) * 100); //更新进度
			//console.log(uploadprogress);
			//res.send(uploadprogress+"");
		});
		form.on('file', function(name, file) {
			var mimetype = file.type;
			//var modname = file.path.split('\\')[file.path.split('\\').length - 1]
			//console.log(file);
			if (/^image/.test(mimetype)) {
				console.log("上传成功");


			} else {
				fs.unlink(file.path, function() {
					console.log("格式不匹配");
				});
			}

		});
		form.parse(req, function(err, fields, files) {
			if (err) {
				console.log('err: ' + err);
				return;
			}
			var path = files.file.path.substring(files.file.path.indexOf('\\'));
			new models.Course.Course({
					title: fields.title,
					author: fields.author,
					summary: fields.summary,
					poster: path
				}).save(function(err, course) {
					if (err) {
						console.log(err);
						fs.unlink(path, function() {
							console.log("删除成功");
						});
						return;
					}
					//console.log(course);
					var cateId = fields.cateId,
						subCateId = fields.subCateId;
					models.Category.Category.findById(cateId, function(err, category) {
						if (err) {
							console.log(err);
							return;
						}
						//console.log(category);
						category.subCategories.id(subCateId).courses.push(course.id)
						category.save(function(err, category) {
							if (err) {
								console.log(err);
								fs.unlink(path, function() {
									console.log("删除成功");
								});
								return;
							}
							//res.redirect('/admin/courselist');
						})
					})
				})
				//console.log(files);
		});
	})

	app.get('/admin/course/:courseId', adminOnly, function(req, res) {
		var courseId = req.params.courseId;
		models.Course.Course.findOne({
				_id: courseId
			},
			'title details.title details.subs.title details.chapter details._id',
			function(err, course) {
				var isExisted = [];
				course.details.forEach(function(chapter) {
					isExisted.push(chapter.chapter);
				})
				res.render('admin/courseedit', {
					title: "编辑课程",
					course: course,
					isExisted: isExisted
				})
			})
	});
	app.post('/admin/addchapter', adminOnly, function(req, res) {
		var courseId = req.body.courseId;
		models.Course.Course.findOne({
			_id: courseId
		}, function(err, course) {
			if (err) {
				console.log(err);
				return;
			}
			var _isExisted = []
			course.details.forEach(function(chapter) {
				_isExisted.push(chapter.chapter);
			});
			if (_isExisted.indexOf(req.body.chapter) != -1) {
				res.send('error: 章节重复')
				return;
			} else {
				course.details.push({
					title: req.body.title,
					chapter: req.body.chapter
				});
				course.save(function(err, course) {
					if (err) {
						console.log(err);
						return;
					}
					res.redirect('/admin/course/' + courseId);
				});
			}
		});
	});
	app.post('/admin/courseedit', adminOnly, function(req, res) {
		//console.log(req.body);
		Course.findOne({
			_id: req.body.courseId
		}, function(err, course) {
			if (err) {
				console.log(err);
				return;
			}
			course.details.id(req.body.chapterId).subs.push({
				title: req.body.subTitle,
				content: req.body.content
			});
			course.save();
			res.redirect('/admin/course/' + req.body.courseId);
		})
	});


	app.post('/admin/register', adminOnly, function(req, res) {
		var password = req.body.password;
		var username = req.body.username;
		var role = req.body.role;
		if (null === username || null === password) {
			return;
		}
		models.Admin.register(username, password, role, function(admin) {
			if (admin) {
				// req.session.role = "admin";
				// req.session.loggedIn = true;
				// req.session.role = 'student';
				// req.session.accountId = account.id;
				// req.session.nickname = account.nickname;
				// res.sendStatus(200);
			}
			res.redirect('/admin/adminlist');
		});
	});
	app.get('/admin/logout', adminOnly, function(req, res) {
		delete res.locals;
		req.session.destroy(function(err) {
			console.log('err ' + err);
		});
		res.redirect('/admin/login');
	});
}