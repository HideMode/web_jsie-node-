//渲染网页主题内容
define(["text!templates/index/content.html"], function(contentTemplate){
	var contentView = Backbone.View.extend({
		el: "#content",//DOM元素

		render: function(){
			this.$el.html(contentTemplate);
		}
	});
	return new contentView();
});