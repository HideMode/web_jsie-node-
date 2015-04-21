jQuery(document).ready(function($) {
	// Validation and Ajax action
	$("form#form-login").validate({
		rules: {
			username: {
				require: true
			},
			loginEmail: {
				required: true
			},

			loginPwd: {
				required: true
			}
		},

		messages: {
			username: {
				require: true
			},
			loginEmail: {
				required: '请输入用户名.'
			},

			loginPwd: {
				required: '请输入密码.'
			}
		}
	});

	// Set Form focus
	$("form#form-login .form-group:has(.form-control):first .form-control").focus();
});