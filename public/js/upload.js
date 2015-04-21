//jQuery(document).ready(function() {
$(function() {
	var data = null
	var cate = $.post('/getCate');
	cate.done(function(data) {
		var sub = []
		for (var i = 0; i < data.length; i++) {
			$('select#cate').append(new Option(data[i].name, data[i]._id));
			sub[data[i]._id] = data[i].subCategories
		}
		$('select#cate').change(function() {
			$('select#subCate').trigger('mychange', [sub]);
		});
	});
	$('select#subCate').on('mychange', function(event, sub) {
		var cateId = $('select#cate option:selected').val()

		if ($('select#cate option:selected').val() == 0) {
			$('select#subCate').css('display', 'none');
			$('select#subCate').empty().append(new Option('请选择二级分类', 0))
		} else {
			$('select#subCate').css('display', 'inline-block')
			$('select#subCate').empty().append(new Option('请选择二级分类', 0))
			for (var i = 0; i < sub[cateId].length; i++) {
				$('select#subCate').append(new Option(sub[cateId][i].name, sub[cateId][i]._id))
			}
		}
	});
	$('#poster').css('display', 'none');
	$('#posterBtn').click(function(event) {
		var courseTitle = $('#title').val(),
			courseAuthor = $('#author').val(),
			courseSummary = $('#summary').val();
		event.preventDefault();
		if ("" === courseTitle || "" === courseAuthor || "" === courseSummary) {
			alert("课程信息不能为空!");
			$('#poster').css('display', 'none');
		} else {
			$('#poster').css('display', 'block');
			$("#uploader").plupload({
				runtimes: 'html5,flash,silverlight,html4',
				url: '/admin/newcourse',
				max_file_count: 20,
				chunk_size: '1mb',
				resize: {
					width: 200,
					height: 200,
					quality: 90,
					crop: false // crop to exact dimensions
				},
				filters: {
					// Maximum file size
					max_file_size: '1000mb',
					prevent_duplicates: true,
					// Specify what files to browse for
					mime_types: [{
						title: "课程海报",
						extensions: "gif,png,jpeg,jpg"
					}]
				},
				rename: true,
				preserve_headers: true,
				dragdrop: true,
				views: {
					list: true,
					thumbs: true, // Show thumbs
					active: 'thumbs'
				},
				multipart_params: {
					title: $('#title').val(),
					author: $('#author').val(),
					summary: $('#summary').val(),
					cateId: $('#cate').val(),
					subCateId: $('#subCate').val()
				},
				// Flash settings
				flash_swf_url: '/libs/bower_components/plupload/js/Moxie.swf',

				// Silverlight settings
				silverlight_xap_url: '/libs/bower_components/plupload/js/Moxie.xap'
			});
			$('#uploader_start').click(function(event) {
				/* Act on the event */

				if ($('#uploader').plupload('getFiles').length > 0) {
					// When all files are uploaded submit form
					$('#uploader').on('complete', function() {
						//$('#form').submit();
					});

					$('#uploader').plupload('start');
				}
			});
			$('#form').submit(function(e) {
				// Files in queue upload them first

				if ($('#uploader').plupload('getFiles').length > 0) {
					// When all files are uploaded submit form
					$('#uploader').on('complete', function() {
						//$('#form')[6].submit();
					});

					$('#uploader').plupload('start');
				} else {
					alert("请添加图片和视频.");
				}
				return false; // Keep the form from submitting
			});
		}
	});
});

//});