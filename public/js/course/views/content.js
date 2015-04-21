define(['text!templates/course/content.html'], function(contentTemplate){
	var contentView = Backbone.View.extend({
		el: "#content",

		render: function(){
			this.$el.html(contentTemplate);
		}
	});

	return contentView;
});