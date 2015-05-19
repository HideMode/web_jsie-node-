module.exports = function(mongoose) {
	var crypto = require('crypto');
	var AdminSchema = new mongoose.Schema({
		username: {
			type: String,
			unique: true,
			require: true
		},
		password: {
			type: String,
			require: true
		},
		//11: normal admin
		//12: super admin
		role: {
			type: Number,
			default: 11
		},
		email: String,
		meta: {
			createtime: {
				type: Date
			},
			lastlogin: {
				type: Date
			}
		}
	});

	AdminSchema.pre('save', function(next) {
		if (this.isNew) {
			this.meta.createtime = this.meta.lastlogin = Date.now();
		} else {
			this.meta.lastlogin = Date.now();
		}
		next();
	});
	AdminSchema.statics = {
		fetch: function(callback) {
			return this.find({}).sort('meta.createtime').exec(callback);
		}
	}
	var Admin = mongoose.model("Admin", AdminSchema);
	var login = function(username, password, callback) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);
		Admin.findOne({
				username: username,
				password: shaSum.digest('hex')
			},
			function(err, result) {
				if (err) console.log(err);
				result.meta.lastlogin = Date.now()
				result.save()
				callback(result);
			});
	};
	var register = function(username, password, role, callback) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);
		var admin = new Admin({
			username: username,
			password: shaSum.digest('hex'),
			role: role
		});
		admin.save(function(err, result) {
			if (err)
				console.log(err);
			callback(result);
		})
	}

	return {
		Admin: Admin,
		login: login,
		register: register
	}
}