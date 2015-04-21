/**
 * 2015/1/26
 */

// 引导启动程序,它实例化全局配置并建立模块依赖关系。它在页面初次加载时由RequireJS负责实例化

//require.config()方法，可以对模块的加载行为进行自定义。
//require.config()就写在主模块的头部。
//参数就是一个对象，这个对象的paths属性指定各个模块的加载路径。


//理论上，require.js加载的模块，必须是按照AMD规范、用define()函数定义的模块。
//但是实际上，虽然已经有一部分流行的函数库（比如jQuery）符合AMD规范，更多的库(bootstrap、backbone)并不符合。
require.config({
	paths: { //文件路径 文件不需要后缀
		Underscore: '/libs/bower_components/underscore/underscore-min',
		Backbone: '/libs/bower_components/backbone/backbone',
		text: '/libs/text', //RequireJS text插件
		templates: '../../templates'
	},

	shim: { //配置依赖项
		//'Underscore': ['jQuery'],
		'Backbone': ['Underscore'],
		'SocialNet': ['Backbone']
	}
});


//RequireJS 加载所有依赖项后,调用SocialNet的initialize方法
//require()函数接受两个参数。第一个参数是一个数组，表示所依赖的模块
//第二个参数是一个回调函数，当前面指定的模块都加载成功后，它将被调用。
//加载的模块会以参数形式传入该函数，从而在回调函数内部就可以使用这些模块
require(['SocialNet'], function(SocialNet) {
	SocialNet.initialize();
});