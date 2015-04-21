module.exports = function(mongoose) {
	var ObjectId = mongoose.Schema.Types.ObjectId;
	var CourseSchema = new mongoose.Schema({
		title: {
			type: String,
			require: true,
			unique: true
		},
		author: String,
		poster: String, //海报
		summary: String,
		video: [{
			type: ObjectId,
			ref: 'Video'
		}],
		category: {
			type: ObjectId,
			ref: 'Category'
		},
		details: [{
			chapter: {
				type: Number,
				index: false
			},
			title: String,
			subs: [{
				title: String,
				content: String,
				video: {
					type: ObjectId,
					ref: 'Video'
				},
				comments: [{
					type: ObjectId,
					ref: 'Comment'
				}]
			}]
		}],
		meta: {
			uploadTime: {
				type: Date,
				default: Date.now()
			},
			updateTime: {
				type: Date,
				default: Date.now()
			}
		}
	});
	CourseSchema.pre('save', function(next) {
		if (this.isNew) {
			this.meta.uploadTime = this.meta.updateTime = Date.now();
		} else {
			this.meta.updateTime = Date.now();
			if(this.details){
				this.details.forEach(function(detail){
					console.log(detail.chapter);
				})
			}
		}
		next();
	});
	// 静态方法
	CourseSchema.statics = {
		fetch: function(callback) { //检索所以数据
			return this
				.find({})
				.sort('meta.updateTime')
				.exec(callback);
		},
		findById: function(CourseId, callback) { //检索一条数据
			return this
				.findOne({
					_id: CourseId
				})
				.exec(callback);
		},
		remove: function(CourseId, callback) {
			return this.remove({
				_id: CourseId
			}).exec(callback);
		}
	}
	var Course = mongoose.model('Course', CourseSchema);
	return {
		Course: Course
	}
}