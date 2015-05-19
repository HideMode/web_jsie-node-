$(function() {
	var ue = UE.getEditor('container');
	var $node;
	$('#previewBtn').on('click', function(event) {
		event.preventDefault();
		$('#preview-modal').modal()
		$('#preview-modal .modal-title').text($('#subTitle').val())
		$('#preview-modal #text-body').html(ue.getContent())
	});
	$('#preview-modal').on('hidden.bs.modal', function(e) {
		$('#preview-modal .modal-title').text("")
		$('#preview-modal #text-body').html(null)
	})
	$('.chapter h3').click(function(event) {
		if ($(this).parent().hasClass('chapter-active')) {
			$(this).next('.sub').slideUp('fast', function() {
				$(this).parent().removeClass('chapter-active');
			});
			$(this).find('span').html('+');
		} else {
			$(this).next('.sub').slideDown('fast', function() {
				$(this).parent().addClass('chapter-active');
			});
			$(this).find('span').html('-');
		}
	});
	$('.subBtn').click(function(event) {
		var chapterId = $(this).data('chapterid')
		$('#delSub').css("display", "none");
		$('#addSub').slideDown('fast', function() {
			//$(this).css('display', 'inline-block');
			window.location.hash="#addSub"
			$('#subchapter').text("添加章节")
			$('input[name="chapterId"]').val(chapterId)
			$('input[name="viewId"]').val(null);
			$('input[name="subTitle"]').val(null);
			ue.setContent("");
		});
	});
	$("ul.sub>li").click(function(event) {
		$node = $(this);

		var dom = event.target;
		var courseId = $('input[name="courseId"]').val()
		var chapterId = $(this).parent().parent().data('chapterid');
		var viewId = $(this).data('viewid');
		UE.ajax.request('/admin/detail', {
			method: 'POST',
			timeout: 5000,
			async: true,
			data: {
				courseId: courseId,
				//chapterId: chapterId,
				viewId: viewId
			},
			onsuccess: function(xhr) {
				var data = JSON.parse(xhr.responseText);
				$('input[name="chapterId"]').val(chapterId)
				$('input[name="viewId"]').val(viewId);
				$('#subTitle').val(data.title);
				ue.setContent(data.content, false);
				$('#addSub').slideDown('fast', function() {
					//$(this).css('display', 'inline-block');
					$('#subchapter').text()
					$('input[name="chapterId"]').val(chapterId)
					window.location.hash = '#addSub'
				});
				$('#previewBtn').on('click', function(event) {
					event.preventDefault();
					$('#preview-modal').modal()
					$('#preview-modal .modal-title').text($('#subTitle').val())
					$('#preview-modal #text-body').html(ue.getContent())
				});
				$('#preview-modal').on('hidden.bs.modal', function(e) {
						$('#preview-modal .modal-title').text("")
						$('#preview-modal #text-body').html(null)
					})
					//delete operation
				$('#delSub').css("display", "inline-block");

			},
			onerror: function(xhr) {
				alert('Ajax请求失败');
			}
		});
	});
	$('#delSub').on('click', function(event) {
		console.log($node);
		event.preventDefault();
		/* Act on the event */
		var del = confirm("是否删除?")
		if (del) {
			var courseId = $('input[name="courseId"]').val();
			var chapterId = $('input[name="chapterId"]').val();
			var viewId = $('input[name="viewId"]').val();
			$.ajax({
					type: 'DELETE',
					url: '/admin/subcourse?courseId=' + courseId + '&chapterId=' + chapterId + '&viewId=' + viewId
				})
				.done(function(results) {
					if (results.success === 1) {
						$('#addSub').slideUp('slow', function() {
							$node.remove();
							$('input[name="viewId"]').val(null);
							$('input[name="subTitle"]').val(null);
							ue.setContent("");
						});
					} else if (results.success === 0) {
						$(".errors-container").html('<div class="alert alert-danger">\
												<button type="button" class="close" data-dismiss="alert" aria-label="Close">\
													<span aria-hidden="true">&times;</span>\
												</button>\
												操作失败,请刷新重试!\
											</div>');
						$(".errors-container .alert").slideUp('fast');
						$(".errors-container .alert").hide().slideDown();
					}
				})
		}
	});

});