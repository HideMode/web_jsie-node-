/**
 * 2015/1/27
 */

//配置数据库相关信息

// Build the connection string
module.exports = function(mongoose) {
	var dbURI = 'mongodb://localhost:27017/web_jsie';
	// Create the database connection
	mongoose.connect(dbURI);

	mongoose.connection.on('connected', function() {
		console.log('Mongoose connected to ' + dbURI);
	});
	mongoose.connection.on('error', function(err) {
		console.log('Mongoose connection error: ' + err);
	});
	mongoose.connection.on('disconnected', function() {
		console.log('Mongoose disconnected');
	});
	process.on('SIGINT', function() {
		mongoose.connection.close(function() {
			console.log('Mongoose disconnected through app termination');
			process.exit(0);
		});
	});
};