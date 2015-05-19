define(['jquery', 'underscore'], function() {
	var loadRelation = function() {
		var data = {};
		data.title = $('.course_title').text();
		data.author = $('#course_author').text();
		var $node = $('.panel_course_relation .panel-body');
		var relationTpl = _.template('<a class="course-relation" href="/course/<%= _id %>" target="_blank">\
			<img src="<%= poster %>" height="60", width="108">\
			<span class="course-title"><%= title %></span></a>')
		var relationHTML = "";
		$.ajax({
			url: '/ajax/course/relation',
			type: 'GET',
			dataType: 'json',
			data: data,
			success: function(resp) {
				if (resp.success) {
					resp.courses.forEach(function(course) {
						relationHTML += relationTpl({
							_id: course._id,
							poster: course.poster.replace("\\", "/"),
							title: course.title
						})
					});
					$node.html(relationHTML);
				}
			},
			error: function() {
				$node.closest(".sidebar").css("visible", "hidden")
			}
		})
	}
	loadRelation()
})