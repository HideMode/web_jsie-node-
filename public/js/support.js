jQuery(document).ready(function($) {
	//模态窗口js
	$(window).load(function() {
		/* Act on the event */
		$('.page-loading-overlay').addClass('loaded');
	});
	var loginHandler = function() {
		$('#modal-body-login').css("display", "block");
		$("#modal-body-register").css("display", "none");
		$('#modal_login').addClass('current');
		$('#modal_register').removeClass('current');
	};
	var registerHandler = function() {
		$("#modal-body-login").css("display", "none");
		$("#modal-body-register").css("display", "block");
		$('#modal_login').removeClass('current');
		$('#modal_register').addClass('current');
	}
	$('#nav_login').click(loginHandler);

	$('#nav_register').click(registerHandler);

	$('#modal_login').click(loginHandler);

	$('#modal_register').click(registerHandler);

	$('#form-login').submit(function(event) {
		/* Act on the event */
		
		event.preventDefault();
		$.post('/login', {
			email: $('input[name=loginEmail]').val(),
			password: $('input[name=loginPwd]').val()
		}, function(data) {
			if ("OK" === data) {
				window.location.href = "/account";
			}
		}).error(function() {
			//console.log(error);
			//alert("error");
		});
	});
	$('#form-register').submit(function(event) {
		/* Act on the event */
		event.preventDefault();
		$.post('/register', {
			email: $('input[name=regEmail]').val(),
			password: $('input[name=regPwd]').val(),
			nickname: $('input[name=regNick]').val()
		}, function(data) {
			//console.log(data); //1.OK
			if ("OK" === data) {
				console.log("创建成功");
				window.location.href = "/account";
				//do smoe func
			}
		});
		return false;
	});
	$('#regNick').keyup(function(event) {
		/* Act on the event */
		event.preventDefault();
		$("#regNick").addClass('loading');
		$.post('/checkname', {
			nickname: $('input[name=regNick]').val()
		}, function(data, textStatus, xhr) {
			/*optional stuff to do after success */
			console.log(data);
			if ('ok' === data)
				$("#regNick").removeClass('loading');

			else if ('failed' === data) {
				$('#regNick').removeClass('loading');
				$('#regNick').parent().parent().append('<div class="error" id="nickError">该用户名已被使用!</div>');
			}

		});
	});
	$('#regNick').keydown(function(event) {
		/* Act on the event */
		$('#regNick').removeClass('loading');
		$('#nickError').remove();
	});
	$("a[data-toggle='tooltip']").tooltip({
		trigger: 'hover',
		template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div>' +
			'<div class="tooltip-inner"></div></div>',
		placement: 'bottom',
		// title: '修改头像'
	});
});