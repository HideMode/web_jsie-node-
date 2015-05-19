$(window).load(function() {
	/* Act on the event */
	$('.page-loading-overlay').addClass('loaded');
});
jQuery(document).ready(function() {
	$('.dropdown-toggle').dropdown();
	/**
	 * 页面导航
	 */
	var pathname = window.location.pathname;
	$("a[href^='/admin']").parent().removeClass('active');
	$("a[href = '" + pathname + "']").parent().addClass('active');

	//Elevator
	$(document).on("scroll", function() {
		var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		if (scrollTop > 0) {
			$("#elevator").fadeIn();
		} else {
			$("#elevator").fadeOut();
		}

	});

});