define([
  'jquery',
  'underscore',
  'backbone'
],

function ($, _, Backbone) {
  'use strict';

  function getLeft ($loop) {
    // Use css instead of position because the
    // draggable from the loop pane is not appended
    // into a track so it will be incorrect.
    return parseFloat($loop.css('left'));
  }

  function getRight ($loop) {
    var left = getLeft($loop);
    var width = $loop.outerWidth();
    return left + width;
  }

  function getHtmlAudio ($loop) {
    return $loop.find('audio')[0];
  }

  return {
    left: getLeft,
    right: getRight,
    audio: getHtmlAudio
  }
});