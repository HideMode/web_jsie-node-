define(['text!templates/account/status.html'], function(statusTemplate) {
	var statusView = Backbone.View.extend({
		template: _.template(statusTemplate),
		render: function(){
			this.$el.html(this.template(this.model));
			return this;
		}
	});
	return statusView;
})