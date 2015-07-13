var mongoose = require('mongoose');
var Course = mongoose.model('Course')
var Category = mongoose.model('Category')

exports.index = function(req, res) {
	var data = req.query; //words
	var keywords = "";
	if (data.word)
		keywords = data.words.trim().split(" ");
	res.render('user/explore', {
		title: '搜索结果',
		keywords: keywords
	})
}
exports.search = function(req, res) {
	var type = req.params.type; //course discuss topic
	var data = req.query;
	var page = data.page,
		pageSize = data.pageSize;
	var keywords = [];
	if (data.words.trim()=='') {
		res.json({
			success: 0
		})
		return;
	}
	keywords = data.words.trim().split(" ");
	var searchHandler = {
		course: function() {
			var courseList = [];

			keywords.forEach(function(word) {
				console.log(word);
				Course.find({
					title: new RegExp(word)
				}, 
				'title author summary poster meta',
				function(err, courses) {
					if (err) {
						console.log(err);
						return;
					}
					console.log(courses);
					res.json({
						success: 1,
						courses: courses
					});
				});
			})

		},
		discuss: function() {
			res.json({
				success: 0
			})
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