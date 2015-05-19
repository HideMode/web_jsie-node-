define(['moment-timezone', 'jquery', 'underscore', '../relation'], function(moment) {
	var hasComment = false;
	var ue;
	var zone = "Asia/Shanghai";
	var commentTpl = _.template('<div class="media item-comment">\
		<div class="media-left"><a class="item-link-avatar" href="/people/<%= info._id %>">\
		<img width="40" height="40" class="item-img-avatar media-object" alt="logo" src="/images/avatar.jpg"></a>\
		</div><div class="media-body"><h4 class="media-heading comment-author-wrap">\
		<a data-tip="个人信息" href="/people/<%= info._id %>"><%= info.nickname %></a><strong> ,个人签名</strong></h4>\
		<div class="comment-content"><%= data.content %></div>\
		</div></div></div>')
	var relpyTpl = _.template('<div class="media item-comment">\
		<div class="media-left"><a class="item-link-avatar" href="/people/<%= info.fromId %>">\
		<img width="40" height="40" class="item-img-avatar media-object" alt="logo" src="/images/avatar.jpg"></a>\
		</div><div class="media-body"><h4 class="media-heading comment-author-wrap">\
		<a href="/people/<%= info.fromId %>"><%= info.from_nickname %></a> <span>回复</span>\
		<a href="/people/<%= info.toId %>"><%= info.to_nickname %></h4>\
		<div class="comment-content"><%= data.content %></div>\
		<div class="comment-foot comment-item-meta"><div class="meta-panel">\
		<span class="meta-time">发布于<%= info.createTime %></span>\
		<a class="meta-item toggle-comment" role="button" href="javascript:;">\
		<span class="glyphicon glyphicon-comment"></span>回复\
		</a></div></div></div></div>')
	var reply = _.template('<div class="item-reply media"><div class="media-left">\
		<a class="item-link-avatar" href="/people/<%= reply.form %>">\
		<img class="item-img-avatar media-object" width="40" height="40" alt="logo" src="/images/avatar.jpg">\
		</a></div><div class="media-body"><h4 class="media-heading reply-author-wrap">\
		<a href="/people/<%= reply.from._id %>"><%= reply.from.nickname %></a>\
		<% if (reply.to) { %>回复<a href="/people/<%= reply.to._id %>"><%= reply.to.nickname %></a><% } %>\
		</h4><div class="comment-content"><p><%= reply.content %></p></div>\
		<div class="comment-foot reply-item-meta"><div class="meta-panel">\
		<span class="meta-time"><%= createTime %></span>\
		<a class="meta-item toggle-reply" data-author="<%= reply.from._id %>" data-commentid="<%= commentId %>" role="button" href="javascript:;">\
		<span class="glyphicon glyphicon-send"><span>回复</span></span></a></div></div></div></div>')

	var replyftTpl = _.template('<div class="comment-box-input"><div class="form-group">\
	<input type="text" class="form-control" placeholder="写下你的评论..." required></div>\
	<div class="command">\
	<a class="r btn btn-primary" role="button" id="addNew" href="#">评论</a>\
	<a class="r command-cancel" name="closeform" href="#">取消</a></div></div></div>')
	var replyftTpl_insert = _.template('<div class="comment-box-input"><div class="form-group">\
	<input type="text" class="form-control" placeholder="写下你的评论..." required></div>\
	<div class="command">\
	<a class="r btn btn-primary" role="button" id="addReply" href="#">评论</a>\
	<a class="r command-cancel" name="closeform" href="#">取消</a></div></div></div>')
		// 新添加元素
	var commentBoxEvent = function() {
		$('.comment-list').delegate('.comment-box-input input.form-control', 'focus', function(event) {
			event.preventDefault();
			$(this).closest('.comment-box-input').addClass('expanded')
		});
		$('.comment-list').delegate('.command-cancel', 'click', function(event) {
			event.preventDefault();
			$(this).closest('.comment-box-input').removeClass('expanded')
			var $node = $(this).closest('.comment-box-input')
			$node.find('input.form-control').val(null)
		});
		$('.comment-list').delegate('#addNew', 'click', function(event) {
			event.preventDefault();
			var $node = $(this).closest('.comment-box-input') //
			var $metaParent = $node.closest('.item-comment').find('.comment-item-meta') //
			var $meta = $metaParent.find('a.meta-item');
			var data = {
				commentId: $meta.data('commentid') //,toId: $meta.data('toid')
			}
			data.content = $node.find('input.form-control').val()
			var node = {
				$node: $node,
				$meta: $meta
			}
			ajaxHandler.postReply(data, node);

		});
		$('.comment-list').delegate('#addReply', 'click', function(event) {
			event.preventDefault();
			var $node = $(this).closest('.comment-box-input')
			var $meta = $node.siblings('.reply-item-meta').find('a.meta-item');
			var data = {
				commentId: $meta.data('commentid'),
				toId: $meta.data('author')
			}
			data.content = $node.find('input.form-control').val()
			var node = {
				$node: $node,
				$meta: $meta
			}
			console.log(data);
			console.log(node);
			ajaxHandler.postReply(data, node);

		});
		$('.comment-list').delegate('.item-reply .toggle-reply', 'click', function(event) {
			var $node = $(this).closest('.media-body');
			if ($node.find('.comment-box-input').length > 0) {
				if ($node.hasClass('open')) {
					$node.removeClass('open')
				}
			} else {
				$node.append(replyftTpl_insert()).addClass('open')
			}

		});

	}
	var ajaxHandler = {
		postComment: function(data) {
			$.ajax({
				url: '/view/comment',
				type: 'POST',
				dataType: 'json',
				data: data,
				success: function(resp) {
					var countNode = $('.comment-count')
					if (resp.success === 1) {
						hasComment = true;
						var date = new Date()
						var dateFormat = date.getFullYear() + '-' + date.getMonth() + 1 + '-' + date.getDate();
						var commentHTML = commentTpl({
							data: data,
							info: resp.info,
							createTime: dateFormat
						})

						$('.comment-list>.comment-title').after(commentHTML)
						countNode.text(parseInt(countNode.text()) + 1)
						$('.view-comment-form').attr('disabled', 'true').css('display', 'none')
						ue.setDisabled();
						ue.setHide();
						bindEventInit();
					}
				},
				error: function() {

				}

			})
		},
		getReply: function(data, node) {
			$.ajax({
				url: '/reply/fetch',
				type: 'GET',
				dataType: 'json',
				data: data,
				success: function(resp) {
					if (resp.success == 1) {
						var commentNode = node.$node.children('.comment-box');
						var replyHTML = ""
						var commentId = resp.replies._id;
						_.each(resp.replies.reply, function(value) {
							var createTime = moment.tz(value.createTime, zone).format("YYYY-MM-DD");
							replyHTML += reply({
								reply: value,
								createTime: createTime,
								commentId: commentId
							})
						});
						replyHTML += replyftTpl()
						commentNode.find('.loading').remove()
						commentNode.append(replyHTML);
					}
				},
				error: function() {}
			});
		},
		postReply: function(data, node) {
			if (data.content == "") {
				return false;
			}
			$.ajax({
				url: '/view/reply',
				type: 'POST',
				dataType: 'json',
				data: data,
				success: function(resp) {
					if (resp.success == 1) {
						//resp.info //	_id: doc.from,nickname: req.session.nickname
						if (!node.$meta.data('num')) {
							//node.$node.closest('.media-body').append('<div class="new-reply">' + data.content + '</div>')
							node.$meta.data('num', 1)
							node.$node.closest('.media-body').removeClass('open')
							node.$node.remove();
						} else {
							var num = parseInt(node.$meta.data('num'));
							if (num <= 0) {
								node.$node.remove();
								node.$meta.data('num', 1);
							} else {
								node.$meta.data('num', (num + 1));
								node.$node.trigger('click')
								node.$node.closest('.comment-box').append('<div class="new-comment">' + data.content + '</div>');
								node.$node.closest('.comment-box-input').remove();
							}
						}
					}
				},
				error: function() {

				}
			})
		}
	}
	var bindEventInit = function() {
		$('.toggle-comment').on('click', function(e) {
			e.stopPropagation()
			var num = parseInt($(this).data('num'));
			var $node = $(this).closest('.media-body');
			if ($node.hasClass('open')) {
				$node.removeClass('open')
				if (num <= 0) {
					$(this).html("<span class='glyphicon glyphicon-comment'><span>添加评论")
				} else {
					$(this).html("<span class='glyphicon glyphicon-comment'><span>" + num + "条评论")
				}
			} else {
				$node.addClass('open')
				$(this).html("<span class='glyphicon glyphicon-comment'><span>收起评论")
					// info.fromId info.toId info.from_nickname info.to_nickname info.createTime
					// data.content data.commentId
				var $node = $(this).closest('.media-body');
				var node = {
					$node: $node
				}
				var commentId = $(this).data('commentid');
				var toId = $(this).data('toid');
				var data = {
					commentId: commentId,
					toId: toId
				}
				if (num <= 0) {
					var hasCreated = $node.find('.comment-box-input').length > 0 ? true : false;
					if (!hasCreated) {
						$node.append(replyftTpl());
					}
				} else {
					var hasCreated = $node.find('.comment-box').length > 0 ? true : false;
					if (!hasCreated) {
						$node.append('<div class="comment-box"><div class="arrow"></div>\
						<div class="loading">正在加载，请稍等</div></div>');
						ajaxHandler.getReply(data, node);
					} else {

					}
				}
			}
		})
		$('.item-link-avatar').on('mouseenter', function() {
			$(this).popover({
				trigger: 'hover',
				placement: 'auto top',
				conetent: 'test'
			})
		})
	}
	var bindEvent = function() {
		bindEventInit();
		if ($('.view-comment-form').length > 0 && !hasComment) {
			ue = UE.getEditor('container');
			$('.view-comment-form .submit-button').on('click', function(e) {
				e.preventDefault()
				$form = $('.view-comment-form');
				var viewId = $('input[name=viewId]').val()
				var content = $('textarea[name=content]').val()
				if (content == "") {
					return false;
				}
				var data = {
					viewId: viewId,
					content: content
				};

				ajaxHandler.postComment(data);
			});
		}

	}

	bindEvent()
	commentBoxEvent()
	$('[data-toggle="tooltip"]').tooltip()
})