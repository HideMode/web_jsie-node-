define(['jQuery', 'Underscore'], function() {
	var isAjax = 0;
	var nextPage = 0;

	var setFixed = function() {
		var t = $(document).scrollTop();
		if (t > 80) {
			var width1 = $("nav.course-sidebar").width();
			var width2 = $(".course-tools").width();
			$(".course-sidebar,.course-tools").addClass('fixed')
			$(".course-sidebar").width(width1)
			$(".course-tools").width(width2)
			$(".course-list").css({
				marginTop: 50
			})
		} else {
			$(".course-sidebar,.course-tools").removeClass('fixed')
			$(".course-list").css({
				marginTop: 0
			})
		}

		var h = $(document).height()
		var wh = $(window).height()
		if (t >= h - wh - 30) {
			if (nextPage > 0) {
				loadCourse(nextPage);
			}
		}
	}
	var showLoading = function() {
		//var top=($(window).height()-80)/2;

		var h = $(".course-list").height() + 5

		if ($(".bg-loading").length > 0) {
			$(".bg-loading").css({
				height: h
			}).fadeIn(100)
		} else {
			$(".course-list").prepend('<div class="bg-loading"></div>')
			$(".bg-loading").css({
				height: h
			}).fadeIn(100)
		}

	}
	var resetLoading = function() {
		$(".bg-loading").css({
			height: $(".course-list").height()
		})
	}
	var hideLoading = function() {
		isAjax = 0
		setTimeout(function() {
			$(".bg-loading").fadeOut(300);
		}, 0)
	}
	var loadCourse = function(page) {
		if (isAjax) {
			return;
		}
		if (!page || page <= 1) {
			showLoading()
			page = 1
		} else {
			$(".course-list").append('<a href="javascript:void(0)" class="btn-next btn-loading"></a>')
		}
		var data = {
			cateId: 0,
			subCateId: 0,
			pageSize: 15,
			page: page,
		}


		//页面导航
		var title;
		var currObj = $(".course-sidebar .selected")
		var title1 = currObj.find("a:first").text()
		data.cateId = currObj.find("a:first").data('cateid')
		title = "<li><a>" + title1 + "</a></li>"
		var currSubObj = currObj.find("ul li.cur")
		if (currSubObj) {
			var title2 = currSubObj.find("a:first").text()
			data.subCateId = currSubObj.find("a:first").data("subid");
			if (title2) {
				title += '<li><a>' + title2 + '</a></li>'
			}
		}
		$(".course-tools").html(title)
		isAjax = 1;
		$.ajax({
			url: "/course/ajaxlist",
			data: data,
			method: "post",
			dataType: "json",
			success: function(resp) {
				nextPage = 0
				isAjax = 0
				var courses = resp.courses
				var listHtml = ""
				if (courses.length > 0) {
					var listTpl = _.template('<div class="col-md-4"><a class="thumbnail" href="/course/<%= course._id %>">\
						<img src="<%= course.poster %>" data-src="holder.js/100%x160" data-holder-rendered="true">\
						<div class="caption"><h5><%= course.title %></h5></div></a></div>');
					_.each(courses, function(course) {
						listHtml += listTpl({
							course: course
						})
					});
				} else {
					listHtml = page == 1 ? '<div class="nodata alert alert-warning">抱歉，没有相关课程。</div>' : '';
				}


				if (page == 1) {
					if ($(".course-list").html() == "") {
						setTimeout(function() {
							$(".course-list").html(listHtml)
						}, 0)
					} else {
						setTimeout(function() {
							$(".course-list").html(listHtml)
							resetLoading()
						}, 100)
					}
					$(".btn-loading").remove();
					if (resp.nextPage) {
						nextPage = page * 1 + 1
					}
					$("html,body").animate({
						scrollTop: 0
					}, 200);
				} else {
					setTimeout(function() {
						if (resp.nextPage) {
							nextPage = page * 1 + 1
						}

						$(".btn-loading").remove();
						$(".course-list").append(listHtml)
					}, 500)
				}

			},
			error: function() {
				isAjax = 0
				setTimeout(function() {
					$(".btn-loading").remove();
				}, 500)
				hideLoading()
			},
			complete: function() {
				isAjax = 0
				hideLoading()
			}

		});
	}
	var bindEvent = function() {
		var timer, timer1, timer2, point = [];
		$(".course-sidebar").on("mouseenter",
			function() {
				clearTimeout(timer2)
			}).on("mouseleave",
			function() {
				timer2 = setTimeout(function() {
					$(".course-category").removeClass('hover')
					$(".course-subcategory").hide();
				})
			})

		$(".course-sidebar .menu-item").on("click", function(event) {
			if (event.stopPropagation)
				event.stopPropagation();
			else
				event.cancelBubble = true;
			var obj = $(this);
			$(".course-sidebar .menu-item.selected").find('li.cur').removeClass('cur');
			$(".course-sidebar .menu-item").removeClass('selected');
			obj.addClass('selected');
			obj.find(".course-subcategory").show()

			loadCourse();
		})
		$(".menu-item").on("mouseenter", function() {
			var _this = $(this)
			var _hover = function() {
				$(".menu-item").removeClass('hover')
				$(".course-subcategory").hide();
				_this.addClass('hover')
				_this.find(".course-subcategory").show()
			}

			timer = setTimeout(function() {
				_hover();
				clearTimeout(timer1)
			}, 10)

			timer1 = setTimeout(function() {
				_hover()
			}, 1000)
		}).on("mouseleave", function() {
			clearTimeout(timer)
			clearTimeout(timer1)
		})
		$('.course-subcategory li a').on('click', function(event) {
			event.preventDefault();
			if (event.stopPropagation)
				event.stopPropagation();
			else
				event.cancelBubble = true;
			var curObj = $('.menu-item.selected')
			curObj.removeClass('selected')
			curObj.find('li.cur').removeClass('cur')
			$this = $(this)
			$this.parent('li').addClass('cur');
			$this.closest('.menu-item').addClass('selected')
			loadCourse();
		});
		$(window).scroll(setFixed)
		setFixed();
		loadCourse();
	}
	bindEvent();

})