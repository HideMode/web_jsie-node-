define(['jquery', 'underscore', '../relation'], function() {
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
		$('.course_btn').delegate('#addCourse', 'click', function(event) {
			event.preventDefault();
			var data = {
				courseId: $('input[name = courseId]').val()
			}
			$.ajax({
				url: '/ajax/attendCourse',
				type: 'POST',
				dataType: 'json',
				data: data,
				success: function(resp) {
					if (resp.success == 1) {
						$('.course_btn').html('<a id="quitCourse" class=" btn-lg btn btn-danger">退出该课程</a>')
					}
				}
			})

		})
		$('.course_btn').delegate('#quitCourse', 'click', function(event) {
			event.preventDefault()
			var data = {
				courseId: $('input[name=courseId]').val()
			}
			$.ajax({
				url: '/ajax/quitCourse',
				type: 'POST',
				dataType: 'json',
				data: data,
				success: function(resp) {
					if (resp.success == 1) {
						$('.course_btn').html('<a id="addCourse" class=" btn-lg btn btn-primary">加入该课程</a>')
					}
				},
				error: function() {

				}
			})
		});

	}
	bindEvent()
		//loadRelation()
})