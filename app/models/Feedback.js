module.exports = function(mongoose) {
	var ObjectId = mongoose.Schema.Types.ObjectId;
	var FeedbackSchema = new mongoose.Schema({
		content: String,
		contact: String,
		meta: {
			createTime: Date,
			from: {
				type: ObjectId,
				ref: 'Account'
			}
		}
	});
	FeedbackSchema.pre('save', function(next) {
		if (this.isNew) {
			this.meta.createTime = Date.now()
		}
		next();
	});
	var Feedback = mongoose.model('Feedback', FeedbackSchema);
	return {
		Feedback: Feedback
	}
}