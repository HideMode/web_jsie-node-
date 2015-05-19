/**
 *2015/1/15
 *账户模型
 *email、password、nickname、actived、photoUrl、biography、createtime
 *数据库
 *register、forgetPassword、changePassword、login
 */
module.exports = function(config, mongoose, nodemailer) {
	var crypto = require('crypto'); //SHA1算法加密
	var ObjectId = mongoose.Schema.Types.ObjectId
	var AccountSchema = mongoose.Schema({
		email: {
			type: String,
			require: true,
			unique: true
		},
		password: {
			type: String,
			require: true
		},
		nickname: {
			type: String,
			require: true,
			unique: true
		},
		//0: normal user
		//1: verified user
		//2: professional user

		//>10: admin
		//>50: super admin
		role: {
			type: Number,
			default: 0
		},
		createTime: Date,
		profile: { //个人详细信息
			signature: {
				type: String
			},
			enrolTime: {
				type: String
			},
			sex: {
				type: Number
			},
			avatar: {
				type: String,
				default: 'avatar.jpg'
			},
			class: Number //
		},
		course: [{
			type: ObjectId,
			ref: 'Course'
		}],
		discuss: {
			quiz: [{
				type: ObjectId,
				ref: 'Discuss'
			}],
			reply: [{
				type: ObjectId,
				ref: 'Discuss'
			}]
		},
		contact: {
			follow: [{
				type: ObjectId,
				ref: 'Account'
			}],
			fan: [{
				type: ObjectId,
				ref: 'Account'
			}]
		} //关注列表
	});
	AccountSchema.methods = { //实例方法
		comparePassword: function(password, callback) {

		}
	};
	AccountSchema.statics = {
		fetch: function(callback) {
			return this.find({}, {
				_id: 0,
				email: 1,
				nickname: 1,
				createTime: 1,
				role: 1
			}).sort('createTime').exec(callback); //?
		}
	};
	AccountSchema.pre('save', function(next) {
		if (this.isNew) {
			console.log(this);
			this.createTime = Date.now()
		} else { // 推送消息 followers
			// flash messages
		}
		next()
	});
	//Create model
	var Account = mongoose.model('Account', AccountSchema);

	var changePassword = function(accountId, oldpassword, newpassword , cb) {
		var shaSum1 = crypto.createHash("sha256");
		var shaSum2 = crypto.createHash("sha256");
		shaSum1.update(oldpassword);
		shaSum2.update(newpassword);
		var oldPassword = shaSum1.digest("hex");
		var newPassword = shaSum2.digest("hex");
		Account.update({
				_id: accountId,
				password: oldPassword
			}, {
				$set: {
					password: newPassword
				}
			}, {
				upsert: false
			},
			function(err, account){
				if(err){
					console.log(err);
					return;
				}else{
					cb(account)
				}
			});
	};


	var forgetPassword = function(email, resetPasswordUrl, callback) {
		var user = Account.findOne({
			email: email
		}, function findAccount(err, result) {
			if (err) {
				//username is not a valid user
				callback(false);
			} else {
				var smtpTransport = nodemailer.createTransport(config.mail);
				resetPasswordUrl += "'?account=' + result.id";
				smtpTransport.sendMail({
					from: 'web_jsie@example.com',
					to: result.email,
					subject: '忘记密码',
					text: 'Click here to reset your password:' + resetPasswordUrl
				}, function forgetPasswordCallback(err) {
					if (err) {
						callback(false);
					} else {
						callback(true);
					}
				});
			}
		});
	};

	var login = function(email, password, callback) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);
		Account.findOne({
				email: email,
				password: shaSum.digest('hex')
			},
			function(err, result) {
				callback(result);
			});
	};

	var register = function(email, password, nickname, callback) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);
		console.log('Registering ' + nickname);
		var account = new Account({ //模型实例
			email: email,
			password: shaSum.digest('hex'),
			nickname: nickname
		});
		account.save(function(err, result) {
			if (err) {
				console.log(err);
				return;
			}
			console.log(nickname + " was registered");
			callback(result);
		});
	};

	var findByString = function(searchStr, callback) {
		//var searchRegex = new RegExp(searchStr, 'i');
		Account.findOne({
			nickname: searchStr
				// {
				// 	$regex: searchRegex
				// }
		}, function(err, result) {
			//console.log(result);
			callback(null !== result); //查询成功
		});
	};

	var findById = function(accountId, callback) {
		Account.findOne({
			_id: accountId
		}, function(err, result) {
			console.log(result);
			callback(result);
		});
	};

	return {
		register: register,
		forgetPassword: forgetPassword,
		changePassword: changePassword,
		login: login,
		findByString: findByString,
		Account: Account
	};
};