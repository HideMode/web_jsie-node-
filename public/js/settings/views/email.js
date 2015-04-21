define(['text!templates/settings/email.html'], function(emailTemplate) {
	var emailView = Backbone.View.extend({
		template: _.template(emailTemplate),
		render: function() {
			this.$el.html(this.template(this.model));
			return this;
		}
	});
	return emailView;
})