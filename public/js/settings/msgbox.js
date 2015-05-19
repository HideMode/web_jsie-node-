define(function() {
	var tpl = {
		info: '<div class="msg-box alert alert-info"><div class="msg-content">' +
			'<span class="glyphicon glyphicon-ok"></span><p></p></div></div>',
		error: '<div class="msg-box alert alert-warning"><div class="msg-content">' +
			'<span class="glyphicon glyphicon-warning-sign"></span><p></p></div></div>'
	}
	function show(s, m, t) {
		var tl = tpl[s],
			$tpl;
		if (!tl) return;
		$tpl = $(tl);
		$tpl.find(".msg-content p").text(m)
		$tpl.appendTo("body");
		$tpl.css({
			marginTop: $tpl.height() / -2,
			marginLeft: Math.min(600, $tpl.width()) / -2
		}).fadeIn().delay(t || 2000).fadeOut(function() {
			$tpl.remove();
		});
	}
	return {
		info: function(m, t) {
			show("info", m, t);
		},
		error: function(m, t) {
			show("error", m, t);
		}
	}
})