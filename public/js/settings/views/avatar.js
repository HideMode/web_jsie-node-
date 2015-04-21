define(['text!templates/settings/avatar.html'],function(avatarTemplate){
	var avatarView = Backbone.View.extend({
		template: _.template(avatarTemplate),
		render: function () {
			this.$el.html(this.template(this.model));
			return this;
		}
	});

	return avatarView;
})