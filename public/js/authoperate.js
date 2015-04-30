$(function() {
	//删除课程
	$('.delCoure').click(function(e) {
		var target = $(e.target)
		var courseId = target.data('courseid')
		var tr = target.closest('tr')
		var del = confirm("是否删除?")
		if (del) {
			$.ajax({
					type: 'DELETE',
					url: '/admin/courselist?courseId=' + courseId
				})
				.done(function(results) {
					if (results.success === 1) {
						if (tr.length > 0) {
							tr.remove()
						}
					} else if (results.success === 0) {
						$(".errors-container").html('<div class="alert alert-danger">\
												<button type="button" class="close" data-dismiss="alert" aria-label="Close">\
													<span aria-hidden="true">&times;</span>\
												</button>\
												删除失败,请刷新重试!\
											</div>');
						$(".errors-container .alert").slideUp('fast');
						$(".errors-container .alert").hide().slideDown();
					}
				})
		}
	})
})