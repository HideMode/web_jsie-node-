define(['text!templates/settings/profile.html'], function(profileTemplate) {
	var profileView = Backbone.View.extend({
		template: _.template(profileTemplate),
		render: function() {
			this.$el.html(this.template(this.model));
			return this;
		}
	});
	return profileView;
})