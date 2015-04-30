define(['msgbox'], function(msgbox){
	var data = null;
	$.ajax({
		url: '/user/info',
		type: 'GET',
		dataType: 'json',
		timeout: 5000
	})
	.done(function(data){

	})
	.fail(function(){
		$(".errors-container").html('<div class="alert alert-danger">\
									<button type="button" class="close" data-dismiss="alert" aria-label="Close">\
										<span aria-hidden="true">&times;</span>\
									</button>\
									个人信息获取失败,请刷新重试!\
								</div>');
			$(".errors-container .alert").slideUp('fast');
			$(".errors-container .alert").hide().slideDown();
	})
	$.ajax({
			url: '/categorylist',
			type: 'GET',
			dataType: 'json'
		})
		.done(function(data) {
			var sub = []
			for (var i = 0; i < data.length; i++) {
				$('select#cate').append(new Option(data[i].name, data[i]._id));
				sub[data[i]._id] = data[i].subCategories
			}
			$('select#cate').change(function() {
				$('select#subCate').trigger('mychange', [sub]);
			});
		})
		.fail(function() {
			$(".errors-container").html('<div class="alert alert-danger">\
									<button type="button" class="close" data-dismiss="alert" aria-label="Close">\
										<span aria-hidden="true">&times;</span>\
									</button>\
									专业信息获取失败,请刷新重试!\
								</div>');
			$(".errors-container .alert").slideUp('fast');
			$(".errors-container .alert").hide().slideDown();
		})
		.always(function() {
			console.log("complete");
		});

	$('select#subCate').on('mychange', function(event, sub) {
		var cateId = $('select#cate option:selected').val()

		if ($('select#cate option:selected').val() == 0) {
			$('select#subCate').css('display', 'none');
			$('select#subCate').empty().append(new Option('请选择专业', 0))
		} else {
			$('select#subCate').css('display', 'inline-block')
			$('select#subCate').empty().append(new Option('请选择专业', 0))
			for (var i = 0; i < sub[cateId].length; i++) {
				$('select#subCate').append(new Option(sub[cateId][i].name, sub[cateId][i]._id))
			}
		}
	});

	$("#profile-submit").click(function(e) {
		console.log(e);
		e.preventDefault();
		var $this = $(this),
			$form;
		if ($this.text() == '正在保存...') {
			return;
		}
		$this.text("正在保存...");

		$form = $this.closest("form");
		var postData = {};
		postData.nickname = $('#profile input#nickname').val()
		postData.sex = $("#profile input[name='sex']:checked").val()
		postData.enroltime = $('#enrol').val()
		$.ajax({
				url: '/user/setprofile',
				type: 'PUT',
				dataType: 'json',
				timeout: 5000,
				data: postData
			})
			.done(function(data) {
				if (data.success === 1) {
					msgbox.info('资料修改成功！')
				} else {
					msgbox.error('资料修改失败！')
				}
				$this.text("保存")
			})
			.fail(function() {
				console.log("error");
				$this.text("保存")
			})
			.always(function() {
				console.log("complete");
			});
	})
})