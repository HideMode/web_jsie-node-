define(['msgbox'], function(msgbox) {
	var data = null;

	var errorAlert = function(msg) {
		$(".errors-container").html('<div class="alert alert-danger">\
					<button type="button" class="close" data-dismiss="alert" aria-label="Close">\
						<span aria-hidden="true">&times;</span>\
					</button>\
					' + msg + '\
				</div>');
		$(".errors-container .alert").slideUp('fast');
		$(".errors-container .alert").hide().slideDown();
	}
	switch (window.location.pathname.split('/')[2]) {

		case 'avatar':
			$("#upload-change-avatar").on("change", function(event) {
				if (!this.value) return;
				this.form.submit();
			});
			break;
		case 'feedback':
			$('button#feedback_submit').on('click', function(event) {
				event.preventDefault();
				if ('' == $('#feedback_info').val()) {
					return;
				}
				var data = {
					feedback_info: $('#feedback_info').val(),
					contact: $('input[name=contact]').val()
				}
				console.log(data);
				$.ajax({
					url: '/user/feedback',
					type: 'POST',
					dataType: 'json',
					data: data,
					success: function(data) {
						if (data.success == 1) {
							msgbox.info('反馈发送成功，我们将尽快解决！');
							$('#feedback_info').val(null)
							$('input[name=contact]').val(null)
						}
					}
				})
			});
			break;
		case 'password':
			$('#pwd_submit').on('click', function(event) {
				event.preventDefault();
				var oldpassword = $('input[name=oldPwd]').val()
				var newpassword = $('input[name=newPwd]').val()
				var repeatPwd = $('input[name=cfmPwd]').val()
				console.log(newpassword);
				console.log(repeatPwd);
				if(''==oldpassword){
					errorAlert('旧密码不能为空！')
					$('input[name=oldPwd]').select()
					return;
				}else if (''== newpassword){
					errorAlert('新密码不能为空！')
					$('input[name=newPwd]').select()
					return;
				}else if (''== repeatPwd){
					errorAlert('确认密码不能为空！')
					$('input[name=cfmPwd]').select()
					return;
				}
				if(newpassword.length<6){
					errorAlert('密码不能少于6位！')
					$('input[name=newPwd]').select()
					return;
				}
				if(newpassword != repeatPwd){
					errorAlert('两次输入的密码不相同！')
					return;
				}
				var data = {
					oldpassword: oldpassword,
					newpassword: newpassword
				}
				$.ajax({
					url: '/user/password',
					type: 'POST',
					dataType: 'json',
					data: data,
					success: function(resp){
						if(resp.success == 1){
							msgbox.info('修改成功！');
						}else{
							msgbox.error('修改失败！')
						}
					},
					error:function() {
						/* Act on the event */
					}
				})
				
			});
			break;
	}
	// $.ajax({
	// 		url: '/user/info',
	// 		type: 'GET',
	// 		dataType: 'json',
	// 		timeout: 5000
	// 	})
	// 	.done(function(data) {
	// 		$('#nickname').val(data.nickname);
	// 		$('#signature').val(data.profile.signature)
	// 	})
	// 	.fail(function() {
	// 		$(".errors-container").html('<div class="alert alert-danger">\
	// 			<button type="button" class="close" data-dismiss="alert" aria-label="Close">\
	// 				<span aria-hidden="true">&times;</span>\
	// 			</button>\
	// 			个人信息获取失败,请刷新重试!\
	// 		</div>');
	// 		$(".errors-container .alert").slideUp('fast');
	// 		$(".errors-container .alert").hide().slideDown();
	// 	})



})