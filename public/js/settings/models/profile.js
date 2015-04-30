define(function(){
	var profile = Backbone.Model.extend({
		initialize: function() {
			this.url = '/backbone/user/info/'
		}
	});
	return profile;
})