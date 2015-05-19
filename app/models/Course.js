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
			view: [{
					type: ObjectId,
					ref: 'View'
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
			console.log("pre save func");
		}
		next();
	});
	CourseSchema.statics = {
		fetch: function(callback) { //检索所以数据
			return this
				.find({})
				.sort('meta.updateTime')
				.exec(callback);
		},
		findById: function(courseId, callback) { //检索一条数据
			return this
				.findOne({
					_id: courseId
				})
				.exec(callback);
		},
		remove: function(courseId, callback) {
			return this.remove({
				_id: courseId
			}).exec(callback);
		}
	}
	var Course = mongoose.model('Course', CourseSchema);
	return {
		Course: Course
	}
}