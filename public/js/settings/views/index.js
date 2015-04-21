// 设置首页
define(function() {
	var indexView = Backbone.View.extend({
		el: '#setting-content',

		render: function(contentHtml) {

			this.$el.html(contentHtml);
		}
	});

	return new indexView();
});