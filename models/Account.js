/**
 *2015/1/15
 *账户模型
 *email、password、nickname、actived、photoUrl、biography、createtime
 *数据库
 *register、forgetPassword、changePassword、login
 */
module.exports = function(config, mongoose, nodemailer) {
	var crypto = require('crypto'); //SHA1算法加密

	var Profile = mongoose.Schema({ //个人详细信息
		signature: {
			type: String
		},
		class: {
			type: String
		},
		sex: {
			type: String
		},
		urlToken: {
			type: String,
			default: 'default.png'
		},
		avatar: {
			type: String
		}
	});

	var Discuss = mongoose.Schema({ //讨论模块
		quiz: { //提问
			questionName: {
				type: String
			},
			questionLink: {
				type: Number
			}
		},
		reply: { //回答
			questionName: {
				type: String
			},
			questionLink: {
				type: Number
			}
		}
	})
	var Course = mongoose.Schema({ //参与的课程信息
			courseId: {
				type: mongoose.Schema.ObjectId
			},
			courseName: {
				type: String
			},
			courseLink: {
				type: Number
			}
		})
		//联系人列表
	var Contact = mongoose.Schema({

		friend: {
			nickname: {
				type: String
			},
			accountId: {
				type: mongoose.Schema.ObjectId
			},

		},
		follower: {
			nickname: {
				type: String
			},
			accountId: {
				type: mongoose.Schema.ObjectId
			}
		}
	});

	var Status = mongoose.Schema({ //个人动态
			questionName: {
				type: String
			},
			questionLink: { //问题编号
				type: Number
			},
			//类型 ? 关注 ?回答
		})
		//Create Schema (define the type and struct of model)
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
		createtime: { // 创建时间
			type: Date,
			default: Date.now()
		},
		profile: [Profile],
		course: [Course],
		discuss: [Discuss], // concern fans star
		contacts: [Contact], //关注列表
		activity: [Status] //动态
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
				createtime: 1,
				role: 1
			}).sort('createtime').exec(callback); //?
		}
	};
	//Create model
	var Account = mongoose.model('Account', AccountSchema);

	var changePassword = function(accountId, newpassword) {
		var shaSum = crypto.createHash("sha256");
		shaSum.update(newpassword);
		var hashedPassword = shaSum.digest("hex");

		Account.update({
				_id: accountId
			}, {
				$set: {
					password: hashedPassword
				}
			}, {
				upsert: false
			},
			function changePasswordCallback(err) {
				if (err)
					return console.log(err);
				return console.log('Change password done for account ' + accountId);
			});
	};


	var forgetPassword = function(email, resetPasswordUrl, callback) {
		var user = Account.findOne({
			email: email
		}, function findAccount(err, result) {
			if (err) {
				//username is not  a valid user
				callback(false);
			} else {
				var smtpTransport = nodemailer.createTransport(config.mail);
				resetPasswordUrl += "'?account=' + result.id";
				smtpTransport.sendMail({
					from: 'web_jsie@example.com',
					to: result.email,
					subject: 'SocialNet Password Request',
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
			nickname: nickname,
			createtime: Date.now()
		});
		account.save(function(err, result) {
			if (err) {
				console.log(err);
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