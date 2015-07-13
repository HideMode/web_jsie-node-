var mongoose = require('mongoose');

var Feedback = require('../models/Feedback')(mongoose);
var Feedback = Feedback.Feedback;

exports.addFeedback = function(req, res) {
	var data = req.body; //feedback_info: '', contact: ''
	var feedback = new Feedback({
		content: data.feedback_info,
		contact: data.contact,
	});
	feedback.meta.from = req.session.accountId
	feedback.save(function(err) {
		if (err) {
			console.log(err);
			return;
		}
		res.json({
			success: 1
		})
	})
}
exports.fetchFeedback = function(req, res) {
	Feedback.find({}).populate({
			path: 'meta.from',
			select: 'nickname email'
		})
		.sort('meat.createTime')
		.exec(function(err, feedbacks) {
			if (err) {
				console.log(err);
				return;
			}
			res.render('admin/feedback', {
				title: '用户反馈',
				feedbacks: feedbacks
			})
		})
}

exports.delFeedback = function(req, res) {
	var id = req.query.id
	Feedback.remove({
		_id: id
	}, function(err) {
		res.json({
			success: 1
		})
	})
}

