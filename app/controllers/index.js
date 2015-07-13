//首页
exports.index = function(req, res) {
	res.render('user/index.jade', {
		title: "主页"
	});
}