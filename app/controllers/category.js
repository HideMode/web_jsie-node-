var mongoose = require('mongoose');
var Category = require('../models/Category')(mongoose);
var Category = Category.Category;
exports.getCate = function(req, res) {
	var query = Category.find({})
	query.select('name subCategories._id subCategories.name')
	query.exec(function(err, categories) {
		if (err) {
			console.log(err);
			return;
		}
		res.json(categories);
	})
}
exports.category = function(req, res) {
	Category.fetch(function(err, categories) {
		if (err) {
			console.log(err);
			return;
		}
		res.render('admin/category', {
			title: "分类信息",
			categories: categories
		})
	})
}

exports.addcategory = function(req, res) {
	var categoryName = req.body.name;
	new Category({
		name: categoryName
	}).save(function(err, category) {
		if (err) {
			console.log(err);
			return;
		}
		res.redirect('/admin/category');
	})
}

exports.addsubcategory = function(req, res) {
	var categoryId = req.body.categoryId;
	var subName = req.body.subName
	Category.findOne({
		_id: categoryId
	}, function(err, category) {
		if (err) {
			console.log(err);
			return;
		}
		category.subCategories.push({
			name: subName
		});
		category.save(function(err, category) {
			if (err) {
				console.log(err);
				return;
			}
			res.redirect('/admin/category');
		})
	})
}

