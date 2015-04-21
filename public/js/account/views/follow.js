define(['text!templates/account/follow.html'], function(followTemplate) {
	var followView = Backbone.View.extend({
		template: _.template(followTemplate),
		render: function(){
			this.$el.html(this.template(this.model));
			return this;
		}
	});
	return followView;
});