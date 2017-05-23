module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "www/styles.css": "www/css/app.less" // destination file and source file
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['www/js/*.js'],
        dest: 'www/scripts.js'
      }
    },
    watch: {
      styles: {
        files: ['www/css/**/*.less'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    }
  });
  grunt.loadNpmTasks('assemble-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['less', 'concat', 'watch']);
};
