//nodemailer配置文件

module.exports = function() {
	return {
		service: 'gmail',
		auth: {
			user: 'sender@gmail.com',
			pass: 'password'
		}
	};
};