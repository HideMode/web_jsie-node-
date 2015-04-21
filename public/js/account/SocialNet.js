define(['router'], function(SocialRouter) {
	var initialize = function() {
		Backbone.history.start();
		if(!window.location.hash)
			Backbone.history.navigate('status', {trigger: true});
	};
	return {
		initialize: initialize
	};
});