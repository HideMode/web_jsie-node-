module.exports = function(mongoose) {
	var ObjectId = mongoose.Schema.Types.ObjectId;
	var CategorySchema = new mongoose.Schema({
		name: {
			type: String,
			unique: true,
			trim: true
		},
		subCategories: [{ // 二级分类
			name: String,
			courses: [{
				type: ObjectId,
				ref: 'Course'
			}]
		}]
	});
	CategorySchema.statics = {
		fetch: function(callback) { //检索所以数据
			return this
				.find({})
				.exec(callback);
		},
		findById: function(CategoryId, callback) { //检索一条数据
			return this
				.findOne({
					_id: CategoryId
				})
				.exec(callback);
		},
		remove: function(CategoryId, callback) {
			return this.remove({
				_id: CategoryId
			}).exec(callback);
		}
	}
	var Category = mongoose.model('Category', CategorySchema);
	return {
		Category: Category
	}
}