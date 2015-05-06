var mongoose = require('mongoose');
var Course = mongoose.model('Course')
var Category = mongoose.model('Category')

exports.index = function(req, res) {
	var data = req.query; //words
	var keywords = [];
	keywords = data.words.trim().split(" ");
	res.render('user/explore', {
		title: '搜索结果',
		keywords: data.words
	})
}
exports.search = function(req, res) {
	var type = req.params.type; //course discuss topic
	var data = req.query;
	var page = data.page,
		pageSize = data.pageSize
	var keywords = [];
	keywords = data.words.trim().split(" ");
	var searchHandler = {
		course: function() {
			var courseList = [];
			console.log("message");
			keywords.forEach(function(word) {
				Course.find({
					title: new RegExp(word)
				}, function(err, courses) {
					if (err) {
						console.log(err);
						return;
					}
					console.log(courses);
					courseList.push(courses)
				});
			})
			console.log(courseList);
			res.json(courseList);
		},
		teacher: function() {
			res.sendStatus(200)
		},
		discuss: function() {
			res.sendStatus(200)
		},
		topic: function() {
			res.senStatus(200)
		}
	}
	switch (type) {
		case 'course':
			searchHandler.course();
			break;
		case 'teacher':
			searchHandler.teacher();
		case 'discuss':
			searchHandler.discuss();
			break;
		case 'topic':
			searchHandler.topic();
			break;
	}
}