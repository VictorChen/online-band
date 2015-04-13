'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    clean: ['app/dist'],
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'app/models/{,*/}*.js',
        'app/util/{,*/}*.js',
        'app/views/{,*/}*.js',
        'app/app.js',
        '!app/scripts/vendor/*'
      ]
    },
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'app/dist/app.css': 'app/styles/app.scss'
        }
      }
    },
    autoprefixer: {
      dist: {
        options: {
          browsers: ['last 100 versions']
        },
        files: [{
          expand: true,
          flatten: true,
          src: 'app/dist/*.css',
          dest: 'app/dist/'
        }]
      }
    },
    requirejs: {
      dist:{
        options: {
          baseUrl: 'app',
          mainConfigFile: 'app/main.js',
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
    },
    connect: {
      server: {
        options: {
          base: 'app',
          keepalive: true
        }
      }
    }
  });

  grunt.registerTask('default', [
    'jshint',
    'clean',
    'sass',
    'autoprefixer',
    'requirejs',
    'uglify'
  ]);
};