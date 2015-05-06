define(['jquery'], function() {
	var bindEvent = function() {
		$('.chapter h3').on('click', function(event) {
			event.preventDefault();
			/* Act on the event */
			if ($(this).parent().hasClass('chapter-active')) {
				$(this).next('.sub').slideUp('fast', function() {
					$(this).parent().removeClass('chapter-active');
				});
				$(".chapter span:eq(1)").html('+')
			} else {
				$(this).next('.sub').slideDown('fast', function() {
					$(this).parent().addClass('chapter-active');
				});
				$(".chapter span:eq(1)").html('-')
			}
		});
		$(".sub li a").on('click', function(event) {
			event.preventDefault();
			/* Act on the event */
			console.log(this.href);
			var courseId = $('input[name=courseId]').val();
		});
	}
	bindEvent()
})