require.config({
	paths: { //文件路径 文件不需要后缀
		Underscore: '/libs/bower_components/underscore/underscore-min',
		Backbone: '/libs/bower_components/backbone/backbone',
		text: '/libs/text', //RequireJS text插件
		templates: '../../templates'
	},

	shim: { //配置依赖项
		'Backbone': ['Underscore'],
		'SocialNet': ['Backbone']
	}
});


require(['SocialNet'], function(SocialNet) {
	SocialNet.initialize();
	//Backbone.history.start();
});