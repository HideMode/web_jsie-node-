/**
 * 2015/1/26
 */

//渲染模板
//text! 前缀指示RequireJS以字符串文本形式加载 templates/index.html 的内容 
//以名为indexTemplate 的变量提供给模块
// define(['text!templates/index/index.html', 'views/modal', 'views/content'], function(indexTemplate,modalView,contentView) {
// 	var indexView = Backbone.View.extend({
// 		el: $('header'),

// 		events: {
// 			"click #nav_login": modalView.openLoginModal,
// 			"click #nav_register": modalView.openRegisterModal
// 		},
// 		render: function(){
// 			this.$el.html(indexTemplate);
// 			modalView.render();
// 			contentView.render();
// 		}
// 	});
// 	return new indexView();
// });

define(['text!templates/index/content.html'], function(contentTemplate) {
	var indexView = Backbone.View.extend({
		el: "#content",

		render: function() {
			this.$el.html(contentTemplate);
		}
	});
	return new indexView();
})