define(['text!templates/account/course.html'], function(courseTemplate){
	var courseView = Backbone.View.extend({
		initialize: function(){
			console.log("test");
		},
		template: _.template(courseTemplate),
		render: function(){
			this.$el.html(this.template(this.model));
			return this;
		}
	});
	return courseView;
});