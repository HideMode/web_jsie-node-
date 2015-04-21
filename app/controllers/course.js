var mongoose = require('mongoose');
var Course = require('../models/Course')(mongoose)
var Category = mongoose.model('Category')
var Course = Course.Course;
var formidable = require('formidable'),
	util = require('util'),
	fs = require('fs'),
	path = require('path');

exports.course = function(req, res) {
	Course.fetch(function(err, courses) {
		res.render('user/course.jade', {
			title: "课程",
			courses: courses
		});
	});
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
}

//admin
exports.newcourse = function(req, res) {
	var form = new formidable.IncomingForm();
	form.uploadDir = "public/uploads/poster";
	form.keepExtensions = true;
	form.on('aborted', function() {
		res.send("failed");
	});
	form.on("end", function() {
		res.redirect('/admin/courselist');
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
			//console.log(course);
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
				})
			})
		})
	});
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
						//item.category = sub.name
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
exports.admincourse = function(req, res) {
	var courseId = req.params.courseId;
	Course.findOne({
			_id: courseId
		},
		//'title details.title details.subs.title details.chapter details._id details.subs._id',
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

exports.courseedit = function(req, res) {
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
}


//获取单节内容
exports.detail = function(req, res) {
	var subId = req.body.subId;
	var chapterId = req.body.chapterId;
	var courseId = req.body.courseId;
	Course.findOne({
		_id: courseId
	}, function(err, course){
		if(err) {
			console.log(err);
			return;
		}
		var subs = course.details.id(chapterId).subs.id(subId);
		res.json(subs);
	})		
}