'use strict';

require.config({
  shim: {
    howler: {
      exports: 'Howler'
    }
  },
  paths: {
    jquery: 'bower_components/jquery/dist/jquery',
    underscore: 'bower_components/underscore/underscore',
    backbone: 'bower_components/backbone/backbone',
    howler: 'bower_components/howler/src/howler.core',
    text: 'bower_components/text/text'
  }
});

require(['app']);