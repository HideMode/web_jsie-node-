module.exports = function(grunt) {
	var path = require('path')
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'), //读取json文件

		watch: {
			jade: {
				files: ['view/**'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['public/js/**', 'models/*.js'],
				//task: ['jshint'],
				options: {
					livereload: true
				}
			}
		},
		nodemon: {
			dev: {
				options: {
					file: 'app.js',
					args: [],
					ignoredFiles: ['README.md', 'node_modules/**', 'public/js/**'],
					watchedExtensions: ['js'],
					watchedFolder: ['config', 'app'],
					debug: true,
					delaytime: 1,
					env: {
						PORT: 8080
					},
					cwd: __dirname
				}
			}
		},
		concurrent: {
			tasks: ['nodemon', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		},
		bower: {
			install: {
				//just run 'grunt bower:install' and you'll see files from your 
				//Bower packages in lib directory
				options: {
					targetDir: './public/static/libs/',
					install: true, //default true
					layout: "byType",
					cleanTargetDir: false,
					cleanBowerDir: false,
				}
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	// 2015/4/29
	grunt.loadNpmTasks('grunt-bower-task');
	grunt.option('force', true);

	// grunt test command
	grunt.registerTask('test', ['jshint', 'qunit']);

	// grunt dist command
	grunt.registerTask('dist', ['concat:dist', 'uglify:dist']);
	// Default task(s).  grunt command
	//grunt.registerTask('default', ['qunit', 'concat', 'uglify']);

	grunt.registerTask('default', 'My default', function() {
		grunt.log.writeln('running default command');
		grunt.task.run(['concurrent']);

	});
	grunt.registerTask('bower', function() {
		grunt.log.writeln('running bower command');
		grunt.task.run(['bower']);
	});

	//project metadata is imported into the Grunt config from the project 's package.json file and 
	//the grunt-contrib-uglify plugin's uglify task is configured to minify a source file and 
	//generate a banner comment dynamically using that metadata. 
	//When grunt is run on the command line, the uglify task will be run by default.
}