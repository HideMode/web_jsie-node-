define(['text!templates/account/myspace.html', 'views/status', 'models/account'],
	function(myspaceTemplate, statusView, account) {
		var myspaceView = Backbone.View.extend({
			el: "#myspace",
			tooltip: function() {
				$("a[data-toggle='tooltip']").tooltip({
					trigger: 'hover',
					template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div>' +
						'<div class="tooltip-inner"></div></div>',
					placement: 'bottom',
					// title: '修改头像'
				});
			},

			render: function() {
				this.$el.html(_.template(myspaceTemplate, {
					variable: 'data'
				})(this.model.status));
				this.tooltip();
				var statusCollection = this.model.content; //用户数据模型
				_.each(statusCollection, function(content) {
					var statusHtml = new statusView({
						model: content
					}).render().el;
					$(statusHtml).appendTo(".content-list");
				});
				// switch (view) {
				// 	case 'statusView':
				// 		this.statusHandler(view);
				// 		break;
				// 	case 'courseView':
				// 		this.courseHandler(view);
				// 		break;
				// 	case 'followView':
				// 		this.followHandler(view);
				// 		break;
				// }


			},
			statusHandler: function(statusView) {
				var statusCollection = this.model.content; //用户数据模型
				_.each(statusCollection, function(content) {
					var statusHtml = new statusView({
						model: content
					}).render().el;
					$(statusHtml).appendTo(".content-list");
				});
			},
			courseHandler: function(courseView) {
				var courseHtml = new courseView({
					model: null
				}).render().el;
				$(courseHtml).appendTo('.content-list');
			},
			followView: function(followView) {
				var followHtml = new followView({
					model: null
				}).render().el;
				$(followHtml).appendTo('.content-list');
			}
		});
		return myspaceView;
	});