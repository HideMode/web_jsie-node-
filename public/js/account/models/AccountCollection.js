define(['models/Account'], function(Account) {
	var AccountCollection = Backbone.Collection.extend({
		model: Account
	});

	return AccountCollection;
});