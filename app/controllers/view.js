var mongoose = require('mongoose');
var Course = mongoose.model('Course')
var View = mongoose.model('View')
var Comment = mongoose.model('Comment')
var Account = mongoose.model('Account')

exports.viewDetail = function(req, res) {
	var viewId = req.params.viewId
	View.findOne({
			_id: viewId
		})
		.populate({
			path: 'comments',
			//select: '_id content',
			options: {
				sort: "meta.votes"
			}
		})
		.exec(function(err, doc) {
			if (err) {
				console.log(err);
				return;
			}
			if (doc) {
				Comment.populate(doc.comments, {
					path: 'from',
					select: '_id nickname profile'
				}, function(err, comments) {
					var info = {
						hasComment: false
					};
					if (err) {
						console.log(err);
						return;
					}
					for (var i = 0; i < comments.length; i++) {
						if (comments[i].from._id == req.session.accountId) {
							info.hasComment = true;
							info.commentId = comments[i]._id;
							break;
						}
					}
					Course.findOne({
							_id: doc.course
						},
						'author details title',
						function(err, course) {
							var viewArray = [];
							info.author = course.author
							info.title = course.title
							course.details.forEach(function(chapter) {
								chapter.view.forEach(function(view) {
									viewArray.push(view.toString());
								})
							})
							var index = viewArray.indexOf(viewId)
							info.prev = viewArray[index - 1] || -1
							info.next = viewArray[index + 1] || -1
							res.render('user/detail', {
								title: doc.title,
								detail: doc,
								info: info
							})
						})
				})
			}
		})
}