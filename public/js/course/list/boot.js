require.config({
	paths: { //文件路径 文件不需要后缀
		Underscore: '/static/libs/underscore-min',
		jQuery: '/static/libs/jquery.min',
		moment: '/static/libs/moment',
		'moment-timezone': '/static/libs/moment-timezone-with-data-2010-2020.min'
	},
	shim: {
		'moment-timezone': {
			deps: ['moment'],
			exports: 'moment'
		}
	}
});

require(['main']);