define(['jquery', 'underscore','./setprofile'], function(){
	var init = function () {
		var pathname = window.location.pathname
		var menu = $('.setting-left .menu').find('#menu-' + pathname.split('/')[2])
		menu.addClass('selected').siblings().removeClass('selected')
	}
	var bindEvent = function () {

	}

	init();
})