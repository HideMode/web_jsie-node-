require.config({
	paths: { //文件路径 文件不需要后缀
		Underscore: '/static/libs/underscore-min',
		jQuery: '/static/libs/jquery.min',
		Moment: '/static/libs/moment'
	},

	shim: { //配置依赖项
	}
});

require(['main']);