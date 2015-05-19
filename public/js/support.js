$(window).load(function() {
	$('.page-loading-overlay').addClass('loaded');
});
jQuery(document).ready(function($) {
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

	$(document).on("scroll", function() {
		var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		if (scrollTop > 0) {
			$("#elevator").fadeIn();
		} else {
			$("#elevator").fadeOut();
		}

	});
	var loginHandler = function() {
		$('.errors-container').html('');
		$('#modal-body-login').css("display", "block");
		$("#modal-body-register").css("display", "none");
		$('#modal_login').addClass('current');
		$('#modal_register').removeClass('current');
	};
	var registerHandler = function() {
		$('.errors-container').html('');
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
		event.preventDefault();
		$.post('/login', {
			email: $('input[name=loginEmail]').val(),
			password: $('input[name=loginPwd]').val()
		}, function(data) {
			var pathname = window.location.pathname;
			if (data.success == 1) {
				if (pathname == "/")
					window.location.pathname = "/account"
				else
					window.location.pathname = pathname
			} else { //0
				errorAlert('账号或密码不正确！')
				$('form#form-login').find('#password').select();
			}
		})
	});

	$('#form-register').submit(function(event) {
		/* Act on the event */
		event.preventDefault();
		if ('' == $('input[name=regPwd]').val() || '' == $('input[name=regEmail]').val() || '' == $('input[name=regNick]').val()) {
			return;
		}
		if ($('input[name=regPwd]').val().length < 6) {
			errorAlert('密码不能少于6位！')
			$('form#form-register').find('#regPwd').select();
			return;
		}
		if ($('input[name=regPwd]').val() != $('input[name=regCfPwd]').val()) {
			errorAlert('两次输入的密码不相同！')
			$('form#form-register').find('#regPwd').select();
			return;
		}
		$.post('/register', {
			email: $('input[name=regEmail]').val(),
			password: $('input[name=regPwd]').val(),
			nickname: $('input[name=regNick]').val()
		}, function(data) {
			if (data.success == 1) {
				window.location.href = "/account";
			} else {
				errorAlert('邮箱已被注册！')
				$('form#form-login').find('#regEmail').select();
			}
		});
		return false;
	});
	$('#regNick').keyup(function(event) {
		event.preventDefault();
		$("#regNick").addClass('loading');
		$.post('/checkname', {
			nickname: $('input[name=regNick]').val()
		}, function(data, textStatus, xhr) {
			console.log(data);
			if (data.success == 1)
				$("#regNick").removeClass('loading');
			else if (data.success == 0) {
				$('#regNick').removeClass('loading');
				$('#regNick').parent().parent().append('<div class="error" id="nickError">该用户名已被使用!</div>');
			}

		});
	});
	$('#regNick').keydown(function(event) {
		$('#regNick').removeClass('loading');
		$('#nickError').remove();
	});
	$("a[data-toggle='tooltip']").tooltip({
		trigger: 'hover',
		template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div>' +
			'<div class="tooltip-inner"></div></div>',
		placement: 'bottom'
	});
	$('#discuss').popover({
		trigger: 'hover'
	})
});
