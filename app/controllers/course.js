var mongoose = require('mongoose');
var Course = require('../models/Course')(mongoose)
var View = require('../models/View')(mongoose)
var Category = mongoose.model('Category')
var Course = Course.Course;
var View = View.View // course sin
var Account = mongoose.model('Account')
var formidable = require('formidable'),
	util = require('util'),
	fs = require('fs'),
	path = require('path'),
	os = require('os');	

	//个人主页
exports.account = function(req, res) {
	Account.findOne({
		_id: req.session.accountId
	},
	'nickname createTime profile course'
	)
	.populate({
		path: 'course',
		select: 'title author meta'
	})
	.exec(function(err, account){
		if(err){
			console.log(err);
			return;
		}
		res.render('user/account', {
			title: "我的主页-"+ account.nickname,
			account: account
		})

	})
}
	
exports.attendCourse = function(req, res) {
	var data = req.body;
	Account.findOne({
		_id: req.session.accountId
	}, function(err, account) {
		if (err) {
			console.log(err);
			return;
		}
		account.course.push(data.courseId);
		account.save(function(err) {
			if (err) {
				console.log(err);
				return;
			}
			res.json({
				success: 1
			})
		})
	})
}

exports.quitCourse = function(req, res) {
	var data = req.body;
	Account.findOne({
		_id: req.session.accountId
	}, function(err, account) {
		if (err) {
			console.log(err);
			return;
		}
		var index= account.course.indexOf(data.courseId)
		account.course.splice(index, 1)
		//account.course.push(data.courseId);
		account.save(function(err) {
			if (err) {
				console.log(err);
				return;
			}
			res.json({
				success: 1
			})
		})
	})
}
exports.course = function(req, res) {
	Category.find({},
		'_id name subCategories',
		function(err, categories) {
			if (err) {
				console.log(err);
				return;
			}
			res.render('user/course', {
				title: "课程列表",
				categories: categories
			})
		})
}
exports.new = function(req, res) {
	res.render('admin/newcourse', {
		title: '录入课程',
	});
}

exports.courseWithParam = function(req, res) {
	var courseId = req.params.courseId;
	Course.findOne({
			_id: courseId
		}).populate({
			path: 'details.view',
			select: '_id title content',
			options: {
				sort: "title"
			}
		})
		.exec(function(err, doc) {
			if (err) {
				console.log(err);
				return;
			}
			if (!doc) {
				return;
			}
			if (req.session.accountId) {
				Account.findOne({
						_id: req.session.accountId
					}, 'course',
					function(err, result) {
						var hasCourse = false;
						if (result.course.indexOf(courseId) != -1) {
							hasCourse = true;
						} else {
							hasCourse = false;
						}
						res.render('user/coursecategory', {
							title: doc.title,
							course: doc,
							hasCourse: hasCourse
						})
					})
			} else {
				res.render('user/coursecategory', {
					title: doc.title,
					course: doc
				})
			}
		});
}

exports.relationlist = function(req, res) {
	var data = req.query;
	if (data.author) {
		Course.find({
				'author': data.author
			},
			'author title _id poster',
			function(err, courses) {
				if (err) {
					console.log(err);
					return;
					res.json({
						success: 0
					})
				}
				res.json({
					success: 1,
					courses: courses
				});
			});
	} else {
		res.json({
			success: 0
		})
	}
}

//admin
exports.newcourse = function(req, res) {
	var form = new formidable.IncomingForm();
	form.uploadDir = "public/uploads/image/poster";
	form.keepExtensions = true;
	form.on('aborted', function() {
	});
	form.on("progress", function(bytesRecieved, bytesExpected) {
		var uploadprogress = Math.ceil((bytesRecieved / bytesExpected) * 100); //更新进度
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
			console.log('err: ' + err);
			return;
		}
		var os_type = os.type().slice(0, 3);
		var path = '/uploads/temp';
		if (os_type == 'Win'){
			path = files.file.path.substring(files.file.path.indexOf('\\'));
		}	
		else if (os_type == 'Lin'){
			path = files.file.path.substring(files.file.path.indexOf('/'));
		}
		new Course({
			title: fields.title,
			author: fields.author,
			summary: fields.summary,
			poster: path
		}).save(function(err, course) {
			if (err) {
				fs.unlink('public' + path, function(err) {
					if (err) console.log(err);
					console.log("删除成功");
				});
				return;
			}
			var cateId = fields.cateId,
				subCateId = fields.subCateId;
			Category.findById(cateId, function(err, category) {
				if (err) {
					console.log(err);
					return;
				}
				category.subCategories.id(subCateId).courses.push(course.id)
				category.save(function(err, category) {
					if (err) {
						console.log(err);
						console.log(path);
						fs.unlink('public' + path, function() {
							console.log("删除成功");
						});
						return;
					}
					res.redirect('/admin/course/' + course._id);

				})
			})
		})
	});
}
exports.ajaxcourselist = function(req, res) {
	var data = req.body;
	var page = parseInt(data.page);
	var pageSize = parseInt(data.pageSize);
	var nextPage = false;
	if (data.cateId) {
		Category.findOne({
				_id: data.cateId
			}).populate({
				path: 'subCategories.courses',
				select: 'title author meta _id poster',
				options: {
					sort: "meta.updateTime"
				}
			})
			.exec(function(err, category) {
				if (err) {
					console.log(err);
					res.json({
						success: 0
					})
				}
				var courses = [];
				var count;
				if (data.subCateId) {
					var items = [];
					var subs = category.subCategories.id(data.subCateId);
					var count = subs.length;
					subs.courses.slice((page - 1) * pageSize, page * pageSize)
						.forEach(function(item) {
							items.push(item);
						})
					courses = items

				} else { // 无subid
					var items = [];
					category.subCategories.forEach(function(sub) {
						sub.courses.forEach(function(item) {
							items.push(item)
						})
					});
					var count = items.length;
					items.slice((page - 1) * pageSize, page * pageSize)
						.forEach(function(item) {
							courses.push(item)
						})
				}
				if (page * pageSize < count) {
					nextPage = true;
				}
				res.json({
					success: 1,
					courses: courses,
					nextPage: nextPage
				})

			})
	} else { // 检索全部
		Category.find({}).populate({
				path: 'subCategories.courses',
				select: 'title author meta _id poster',
				opstions: {
					sort: 'meta.updateItme'
				}
			})
			.exec(function(err, categories) {
				var courses = [],
					items = [];
				categories.forEach(function(category) {
					category.subCategories.forEach(function(sub) {
						sub.courses.forEach(function(item) {
							items.push(item);
						})
					})
				})
				var count = items.length;
				items.slice((page - 1) * pageSize, page * pageSize)
					.forEach(function(item) {
						courses.push(item);
					})
				if (page * pageSize < count) {
					nextPage = true;
				}
				res.json({
					success: 1,
					courses: courses,
					nextPage: nextPage
				})
			})
	}
}

exports.courselist = function(req, res) {
		Category.find({}).populate({
				path: 'subCategories.courses',
				select: 'title author meta'
			})
			.exec(function(err, categories) {
				var courses = [];
				categories.forEach(function(category) {
					category.subCategories.forEach(function(sub) {
						sub.courses.forEach(function(item) {
							courses.push(item);
						})
					})
				})
				res.render('admin/courselist', {
					title: "课程列表",
					courses: courses,
					categories: categories
				})
			})
	}
	// 编辑页面
exports.admincourse = function(req, res) {
	var courseId = req.params.courseId;
	Course.findOne({
			_id: courseId
		}).populate({
			path: 'details.view',
			select: '_id title content',
			options: {
				sort: "title"
			}
		})
		.exec(function(err, doc) {
			if (err) {
				console.log(err);
				return;
			}
			if (!doc) {
				return;
			}
			var isExisted = [];
			doc.details.forEach(function(chapter) {
				isExisted.push(chapter.chapter);
			})
			res.render('admin/courseedit', {
				title: "编辑课程",
				course: doc,
				isExisted: isExisted
			})

		})
}
exports.addchapter = function(req, res) {
	var courseId = req.body.courseId;
	Course.findOne({
		_id: courseId
	}, function(err, course) {
		if (err) {
			console.log(err);
			return;
		}
		if (!course) {
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
}

//add and update
exports.courseedit = function(req, res) {
	var viewId = req.body.viewId
	var chapterId = req.body.chapterId;
	var courseId = req.body.courseId;
	if (null === courseId || null === chapterId) {
		return;
	}
	Course.findOne({
		_id: courseId
	}, function(err, course) {
		if (err) {
			console.log(err);
			return;
		}
		var subTitle = req.body.subTitle
		var content = req.body.content;
		if (null === subTitle) {
			console.log("标题为空");
			return;
		}
		if (viewId) {
			//update
			View.findOneAndUpdate({
				_id: viewId
			}, {
				title: subTitle,
				content: content
			}, function(err, doc) {
				if (err) {
					console.log(err);
					return;
				}
				res.redirect('/admin/course/' + courseId);
			})
		} else {
			//add
			var view = new View({
				title: subTitle,
				content: content,
				course: courseId
			})
			view.save(function(err) {
				if (err) {
					console.log(err);
					return;
				}
				course.details.id(chapterId).view.push(view)
				course.save(function(err) {
					if (err) {
						console.log(err);
						return;
					}
					res.redirect('/admin/course/' + courseId);
				})
			})
		}

	})
}


//获取单节内容
//deprecate subId chapterId courseId
//use model View for details
//both admin and user view
exports.detail = function(req, res) {
	var viewId = req.body.viewId
	View.findOne({
		_id: viewId
	}, function(err, doc) {
		if (err) {
			console.log(err);
			return;
		}
		res.json(doc)
	})
}

exports.delsub = function(req, res) {
	var courseId = req.query.courseId;
	var chapterId = req.query.chapterId
	var viewId = req.query.viewId
	if ("" === courseId || "" === chapterId || "" === viewId) {
		res.json({
			success: 0
		});
		return;
	}
	Course.findOne({
		_id: courseId
	}, function(err, course) {
		if (course) {
			var chapter = course.details.id(chapterId)
			var index = -1;
			for (var i = 0; i < chapter.view.length; i++) {
				if (chapter.view[i].toString() == viewId) {
					index = i;
					break;
				}
			}
			if (index == -1) {
				res.json({
					success: 0
				});
				return;
			}
			var view = chapter.view.splice(index, 1);
			course.save(function(err) {
				if (err) {
					console.log(err);
					res.json({
						success: 0
					});
					return;
				}
				View.remove({
					_id: viewId
				}).exec(function(err) {
					if (err) {
						console.log(err);
						res.json({
							success: 0
						});
					}
					res.json({
						success: 1
					})
				})
			})
		}
	})
}
exports.delcourse = function(req, res) {
	var courseId = req.query.courseId;
	if (null === courseId) {
		return;
	}
	Course.findByIdAndRemove(courseId, function(err, course) {
		if (err) {
			console.log(err);
			return;
		}
		if (!course) {
			return;
		}
		course.details.forEach(function(chapter) {
			chapter.view.forEach(function(viewId) {
				View.remove({
					_id: viewId
				}).exec(function(err) {
					console.log("message");
				})
			})
		})
		fs.unlink('public' + course.poster, function() {
			console.log("删除海报");
		});
		if (err) {
			console.log(err);
			res.json({
				success: 0
			})
			return;
		}
		res.json({
			success: 1
		})
	})
}
