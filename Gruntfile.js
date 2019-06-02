module.exports = function (grunt) {
	grunt.initConfig({
		babel: {
			dist: {
				files: {
					'lib/extractivate.js': 'src/extractivate.js'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-babel');
	grunt.registerTask('default', ['babel']);
};
