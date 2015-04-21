define(['views/myspace', 'views/course', 'views/status', 'views/follow', 'models/Account'],
	function(myspaceView, courseView, stautsView, followView, Account) {
		var SocialRouter = Backbone.Router.extend({
			el: '.content-list',
			routes: {
				'status': 'status',
				'course': 'course',
				'follow': 'follow'
			},
			course: function() {
				$('.nav>li').removeClass('active');
				$('#courseNav').addClass('active');
				var html = new courseView({
					model: null
				}).render().el;
				$('.content-list').empty().append(html);
			},
			follow: function() {
				$('.nav>li').removeClass('active');
				$('#followNav').addClass('active');
				var html = new followView({
					model: null
				}).render().el;
				$('.content-list').empty().append(html);
			},
			status: function() {
				$('.nav>li').removeClass('active');
				$('#statusNav').addClass('active');

				
				var account = new Account();

				account.fetch({
					success: function(model, resp) {
						(new myspaceView({
							model: resp
						})).render();
					},
					error: function(model, resp) {
						console.log('error arguments: ', arguments);
						console.log("error retrieving model");
					}
				});

			}
		});
		return new SocialRouter();
	});