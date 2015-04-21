define(function() {
	var Account = Backbone.Model.extend({
		
		initialize: function(){
			this.url = '/account/status';
		}
	});
	return Account;
});