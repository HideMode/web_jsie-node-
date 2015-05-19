module.exports = function(mongoose) {
	var Schema = mongoose.Schema;
	var ObjectId = Schema.Types.ObjectId;
	var Discuss = new mongoose.Schema({
		title: {
			type: String,
			unique: true
		},
		owner: {
			type: ObjectId,
			ref: 'Account'
		},
		content: String,
		meta: {
			createTime: {
				type: Date
			},
			followers: [{
				type: ObjectId,
				ref: 'Account'
			}]
		}
	})
	DiscussSchema.pre('save', function(next) {
		if (this.isNew) {
			this.meta.createTime = Date.now()
		}else { // 推送消息 followers
			// flash messages
		}
		next()
	});
	var Discuss = mongoose.model('Discuss', DiscussSchema)
}