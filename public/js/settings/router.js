define(['views/index', 'views/avatar', 'views/email', 'views/profile', 'views/password'],
	function(indexView, avatarView, emailView, profileView, passwordView) {
		var SocialRouter = Backbone.Router.extend({

			initialize: function() {},
			routes: {
				"avatar": "avatar",
				"email": "email",
				"profile": "profile",
				"password": "password"
			},

			avatar: function() {
				$('.menu-item').removeClass('selected');
				$('#menu-avatar').addClass('selected');
				var contentHtml = new avatarView({
					model: null
				}).render().el;
				indexView.render(contentHtml);
				window.document.title="头像设置";
			},

			email: function() {
				$('.menu-item').removeClass('selected');
				$('#menu-email').addClass('selected');
				var contentHtml = new emailView({
					model: null
				}).render().el;
				indexView.render(contentHtml);
				window.document.title="邮箱设置";
			},

			profile: function() {
				$('.menu-item').removeClass('selected');
				$('#menu-profile').addClass('selected');
				var contentHtml = new profileView({
					model: null
				}).render().el;
				indexView.render(contentHtml);
				window.document.title="账号设置";
			},

			password: function() {
				$('.menu-item').removeClass('selected');
				$('#menu-password').addClass('selected');
				var contentHtml = new passwordView({
					model: null
				}).render().el;
				indexView.render(contentHtml);
				window.document.title="密码设置";
			}
		});

		return new SocialRouter();
	});