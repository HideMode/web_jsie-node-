var mongoose = require('mongoose');
var Comment = require('../models/Comment')(mongoose);
var Account = mongoose.model('Account')
var View = mongoose.model('View')
var Comment = Comment.Comment
exports.postViewComment = function(req, res) {
	var data = req.body; // viewId
	View.findOne({
		_id: data.viewId
	}, function(err, view) {
		if (err) {
			console.log(err);
			res.json({
				success: 0
			})
			return;
		}
		var comment = new Comment({
			content: data.content,
			from: req.session.accountId
		});
		comment.save(function(err, doc) {
			if (err) {
				console.log(err);
				res.json({
					success: 0
				})
				return;
			}
			view.comments.push(comment)
			view.save(function(err) {
				if (err) {
					console.log(err);
					res.json({
						success: 0
					})
					return;
				}
				var info = {
					_id: doc.from,
					nickname: req.session.nickname,
					avatar: req.session.avatar
				}
				res.json({
					success: 1,
					info: info
				})
			})
		})
	})
}

exports.postCommentReply = function(req, res) {
	var data = req.body;
	Comment.findOne({
		_id: data.commentId
	}, function(err, comment) {
		if (err) {
			console.log(err);
			return;
			res.json({
				success: 0
			})
		}
		if (comment) {
			comment.reply.push({
				from: req.session.accountId,
				to: data.toId,
				content: data.content
			})
			comment.save(function(err) {
				if (err) {
					console.log(err);
					return;
				}
				res.json({
					success: 1
				})
			})
		}
	})
}
exports.getCommentReply = function(req, res) {
	var data = req.query;
	Comment.findOne({
			_id: data.commentId
		},
		'reply'
	).populate({
		path: 'reply.from reply.to',
		select: '_id nickname profile.avatar'
	}).exec(function(err, replies) {
		if (err) {
			console.log(err);
			res.json({
				success: 0
			})
			return;
		}
		res.json({
			success: 1,
			replies: replies
		})
	})
}