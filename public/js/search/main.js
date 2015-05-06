define(['jquery', 'underscore'], function() {
	var isAjax = false;
	var nextPage = 0;
	// var loadNextPage = function() {
	// 	var h = $(document).height()
	// 	var wh = $(window).height()
	// 	if (t >= h - wh - 30) {
	// 		if (nextPage > 0) {
	// 			getSearchData(nextPage);
	// 		}
	// 	}
	// }
	// <a class="zg-btn-white zu-button-more" aria-role="button">更多</a>
	var getSearchData = function(page) {
		if (isAjax) return;
		var words = $('#subsearch input[name=words]').val();
		var data = {
			page: page,
			pageSize: 5,
			words: words
		};
		var url = "";
		url = $(".search-tabs li.active a").data('href');
		if (!page || page < 1) {
			page = 1
		}
		if (page) {
			data.page = page
		}
		console.log(data);
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'json',
			data: data,
			timeout: 5000,
			success: function(resp) {
				isAjax = false;
				var data = resp.course;

				if (resp.nextPage) {
					// 更多
					nextPage = page * 1 + 1;
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


		// init
		getSearchData();
	}
	bindEvent();
})