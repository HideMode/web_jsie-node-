module.exports = function(mongoose) {
	var Schema = mongoose.Schema;
	var ObjectId = Schema.Types.ObjectId;

	var CommentSchema = new mongoose.Schema({
		course: {
			type: ObjectId,
			ref: 'Course'
		},
		from: {
			type: ObjectId,
			ref: 'Account'
		},
		reply: [{
			from: {
				type: ObjectId,
				ref: 'Account'
			},
			to: {
				type: ObjectId,
				ref: 'Account'
			},
			content: String
		}],
		content: String,
		meta: {
			createAt: {
				type: Date(),
				default: Date.now()
			},
			updateAt: {
				type: Date(),
				default: Date.now()
			}
		}
	});
	CommentSchema.pre('save', function(next) {
		if (this.isNew) {
			this.meta.createAt = this.meta.updateAt = Date.now()
		} else {
			this.meta.updateAt = Date.now()
		}

		next()
	});

	CommentSchema.statics = {
		fetch: function(cb) {
			return this
				.find({})
				.sort('meta.updateAt')
				.exec(cb)
		},
		findById: function(id, cb) {
			return this
				.findOne({
					_id: id
				})
				.exec(cb)
		}
	};

	var Comment = mongoose.model('Comment', CommentSchema);
	return {
		Comment: Comment
	};
}