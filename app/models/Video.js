module.exports = function(mongoose) {
	var ObjectId = mongoose.Schema.Types.ObjectId;
	var VideoSchema = mongoose.Schema({
		title: String,
		flash: String,
		course: {
			type: ObjectId,
			ref: 'Course'
		}
	});

	//保存之前的操作
	VideoSchema.pre('save', function(next) {
		if (this.isNew) {
			this.meta.uploadTime = this.meta.updateTime = Date.now();
		} else {
			this.meta.updateTime = Date.now();
		}
		next();
	});
	// 静态方法
	VideoSchema.statics = {
		fetch: function(callback) { //检索所以数据
			return this
				.find({})
				.sort('meta.updateTime')
				.exec(callback);
		},
		findById: function(videoId, callback) { //检索一条数据
			return this
				.findOne({
					_id: videoId
				})
				.exec(callback);
		},
		remove: function(videoId, callback) {
			return this.remove({
				_id: videoId
			}).exec(callback);
		}
	}
	var Video = mongoose.model('Video', VideoSchema);
	return {
		Video: Video
	}
}