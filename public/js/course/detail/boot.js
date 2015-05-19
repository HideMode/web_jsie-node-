require.config({
	paths: {
		underscore: '/static/libs/underscore',
		jquery: '/static/libs/jquery.min',
		moment: '/static/libs/moment',
		'moment-timezone': '/static/libs/moment-timezone-with-data-2010-2020.min'
	},
	shim: {
		'moment-timezone': {
			deps: ['moment'],
			exports: 'moment'
		}
	}
})

require(['main'])