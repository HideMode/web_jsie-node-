module.exports = function(mongoose) {
	var ObjectId = mongoose.Schema.Types.ObjectId;
	var ViewSchema = new mongoose.Schema({
		title: String,
		content: String,
		course: {
			type: ObjectId
		},
		comments: [{
			type: ObjectId,
			ref: 'Comment'
		}]
	})
	ViewSchema.pre('save', function(next) {
		next();
	});
	// 静态方法
	ViewSchema.statics = {
		fetch: function(callback) { //检索所以数据
			return this
				.find({})
				.exec(callback);
		}
	}
	var View = mongoose.model('View', ViewSchema)
	return {
		View: View
	}
}