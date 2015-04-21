/**
 * 2015/1/26
 */

//require.js加载的模块，采用AMD规范。
//规定:模块必须采用特定的define()函数来定义。
//第一个参数必须是一个数组指明该模块的依赖性,或者为空(不依赖其他模块)
//
define(['views/index'], function(indexView, router) {
	var initialize = function() {
		indexView.render();
	};
	return {
		initialize: initialize
	};
});



//身份验证

/**
 * 2015/1/25
 */
// define(['router'], function(router) {
// 	var initialize = function() {
// 		checkLogin(runApplicatioin);
// 	};

// 	var checkLogin = function(callback) {
// 		$.ajax('/account/authenticated', {
// 			method: 'GET',
// 			success: function() {
// 				return callback(true);
// 			},
// 			error: function(data) {
// 				return callback(false);
// 			}
// 		});
// 	};

// 	var runApplication = function(authenticated) {
// 		if (!authenticated) {
// 			alert("unauthenticated");
// 		} else {
// 			alert("authenticated");
// 		}
// 		//建立程序的路由控制或实现对回退按钮的支持 调用历史记录API
// 		Backbone.histroy.start();
// 	};

// 	return {
// 		initialize: initialize
// 	};
// });