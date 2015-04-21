define(['text!templates/settings/password.html'], function(passwordTemplate) {
	var passwordView = Backbone.View.extend({
		template: _.template(passwordTemplate),

		render: function() {
			this.$el.html(this.template(this.model));
			return this;
		}
	});
	return passwordView;
})