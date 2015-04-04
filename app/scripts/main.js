'use strict';

require.config({
  shim: {
    'howler': {
      exports: 'Howler'
    }
  },
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery',
    'howler': '../bower_components/howler/src/howler.core'
  }
});

require(['app']);