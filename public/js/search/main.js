define(['jquery', 'underscore'], function() {
	var isAjax = false;
	var nextPage = 0;
	var courseTpl = _.template('<li class="course"><h2 class="title">\
		<a target="_blank" href="/course/<%= course._id %>"><%= course.title %></a></h2>\
		<div class="tip"><span>讲师:<%= course.author %></span></div>\
		<div class="content clearfix"><div class="thumbnail">\
		<a target="_blank" href="/course/<%= course._id %>">\
		<img src="<%= course.poster%>"></a></div>\
		<div class="introduction">课程简介:<%= course.summary %></div></div></li>')
	var getSearchData = function(type, page) {
		if (isAjax) return;
		var words = $('#subsearch input[name=words]').val();
		var data = {
			page: page,
			pageSize: 5,
			words: words
		};
		var url = "";
		url = $(".search-tabs li.active a").data('url');
		if (!page || page < 1) {
			page = 1
		}
		if (page) {
			data.page = page
		}
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'json',
			data: data,
			timeout: 5000,
			success: function(resp) {
				isAjax = false;
				if (resp.success == 1) {
					if (resp && resp.courses.length > 0) {
						var listHTML = ""
						console.log(resp);
						_.each(resp.courses, function(course) {
							console.log(course);
							listHTML += courseTpl({
								course: course
							})
						});
						$('.search-course').empty().append('<ul>' + listHTML + '</ul>')
					}else{
						$('.search-course').empty().append('<div class="empty-result"><p>非常抱歉，没有找到相关的内容。</p></div>')
					}
				} else {
					$('.search-course').empty().append('<div class="empty-result"><p>非常抱歉，没有找到相关的内容。</p></div>')
				}
			},
			error: function() {
				isAjax = false;
			},
		})


	}

	var bindEventHandler = {
		searchTypeClick: function(event) {
			event.preventDefault();
			isAjax = false;
			nextPage = 0;
			if ($(this).parent().hasClass('active')) return;
			$(this).parent().addClass('active').siblings().removeClass('active');
			$(this).tab('show');
			getSearchData();
		}
	}

	var bindEvent = function() {
		$('.search-tabs a').on('click', bindEventHandler.searchTypeClick)
		$('#search-btn').on('click', function(event) {
			event.preventDefault();
			getSearchData();
		});

		// init
		getSearchData();
	}
	bindEvent();
})