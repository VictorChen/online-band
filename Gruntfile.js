'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    clean: ['client/dist'],
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'client/scripts/{,*/}*.js',
        '!client/scripts/vendor/*'
      ]
    },
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'client/dist/main.css': 'client/styles/main.scss'
        }
      }
    },
    requirejs: {
      dist:{
        options: {
          baseUrl: 'client/scripts',
          mainConfigFile: 'client/scripts/main.js',
          name: 'app',
          out: 'client/dist/app.js',
          optimize: 'none',
          wrap: true
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'client/dist/app.min.js': ['client/dist/app.js']
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