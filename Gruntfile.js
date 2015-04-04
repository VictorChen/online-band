'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    clean: ['app/dist'],
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'app/scripts/{,*/}*.js',
        '!app/scripts/vendor/*'
      ]
    },
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'app/dist/main.css': 'app/styles/main.scss'
        }
      }
    },
    requirejs: {
      dist:{
        options: {
          baseUrl: 'app/scripts',
          mainConfigFile: 'app/scripts/main.js',
          name: 'app',
          out: 'app/dist/app.js',
          optimize: 'none',
          wrap: true
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'app/dist/app.min.js': ['app/dist/app.js']
        }
      }
    }
  });

  grunt.registerTask('default', [
    'clean',
    'jshint',
    'sass',
    'requirejs',
    'uglify'
  ]);
};