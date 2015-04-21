jQuery(document).ready(function($) {
	// Validation and Ajax action
	$("form#form-login").validate({
		rules: {
			username: {
				required: true
			},
			password: {
				required: true
			}
		},

		messages: {
			username: {
				required: '请输入用户名.'
			},

			password: {
				required: '请输入密码.'
			}
		},

		// Form Processing via AJAX
		submitHandler: function(form) {
			//show_loading_bar(70); // Fill progress bar to 70% (just a given value)

			var opts = {
				"closeButton": true,
				"debug": false,
				"positionClass": "toast-top-full-width",
				"onclick": null,
				"showDuration": "300",
				"hideDuration": "1000",
				"timeOut": "5000",
				"extendedTimeOut": "1000",
				"showEasing": "swing",
				"hideEasing": "linear",
				"showMethod": "fadeIn",
				"hideMethod": "fadeOut"
			};
			$.post('/admin/login', {
				username: $('input[name=username]').val(),
				password: $('input[name=password]').val()
			}, function(resp) {
				/*optional stuff to do after success */
				// Show errors
				if (resp.accessGranted == true) {
					window.location.href = "/admin";
				} else if (resp.accessGranted == false) {
					$(".errors-container").html('<div class="alert alert-danger">\
												<button type="button" class="close" data-dismiss="alert" aria-label="Close">\
													<span aria-hidden="true">&times;</span>\
												</button>\
												' + resp.errors + '\
											</div>');

					// Remove any alert
					$(".errors-container .alert").slideUp('fast');
					$(".errors-container .alert").hide().slideDown();
					$('form#form-login').find('#password').select();
				}
			});



			// $.ajax({
			// 	url: "/admin/login",
			// 	method: 'POST',
			// 	dataType: 'json',
			// 	data: {
			// 		username: $(form).find('#username').val(),
			// 		password: $(form).find('#password').val(),
			// 	},
			// 	success: function(resp) {

			// 		if ("OK" === resp) {
			// 			window.location.href = '/admin';
			// 		} else {
			// 			alert('er')
			// 			toastr.error("You have entered wrong password, please try again. User and password is <strong>demo/demo</strong> :)", "Invalid Login!", opts);
			// 			$password.select();
			// 		}
			// 	}
			// });

		}
	});

	// Set Form focus
	$("form#login .form-group:has(.form-control):first .form-control").focus();
});