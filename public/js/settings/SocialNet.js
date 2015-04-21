define(['router'], function(router) {
	var initialize = function() {		
		Backbone.history.start({
			root: '/settings'
		});
		if(!window.location.hash)
			Backbone.history.navigate('profile', {trigger: true});
	};
	return {
		initialize: initialize
	}

});