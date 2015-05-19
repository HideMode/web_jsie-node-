module.exports = function(mongoose) {
	var Schema = mongoose.Schema;
	var ObjectId = Schema.Types.ObjectId;

	var CommentSchema = new mongoose.Schema({
		view: {
			type: ObjectId,
			ref: 'View'
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
			content: String,
			createTime: {
				type: Date,
				default: Date.now()
			}
		}],
		content: String,
		meta: {
			createTime: {
				type: Date,
				default: Date.now()
			},
			updateTime: {
				type: Date,
				default: Date.now()
			},
			votes: {
				type: Number,
				default: 0
			}
		}
	});
	CommentSchema.pre('save', function(next) {
		if (this.isNew) {
			this.meta.createTime = this.meta.updateTime = Date.now()
		} else {
			this.meta.updateTime = Date.now()
		}
		if (this.reply.isNew) {
			console.log("reply save date");
			this.reply.createTime = Date.now()
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