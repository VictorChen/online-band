define([
  'jquery',
  'underscore',
  'backbone',
  './loop_helper',
  './constants'
],

function ($, _, Backbone, loopHelper, constants) {
  'use strict';

  // Make use of backbone events
  var events = _.extend({}, Backbone.Events);

  function hasCollision ($track, $loop) {
    var collision = false;
    var width = $loop.outerWidth();
    var left = loopHelper.left($loop);
    var right = loopHelper.right($loop);

    // Too far left, overlapping with the tracks. Let's just move it
    // to the front for them
    if (left < 0) {
      left = 0;
      right = width;
      $loop.css('left', 0);
    }

    // See if the current position collides with anything in the track
    $track.find('.track-loop').each(function () {
      var $this = $(this);
      // Don't compare itself
      if (!$this.is($loop)) {
        var currentLeft = loopHelper.left($this);
        var currentRight = loopHelper.right($this);
        if ((currentLeft < left && currentRight > left) ||
          (currentLeft > left && currentLeft < right)) {
          collision = true;
          return; // break out of loop
        }
      }
    });
    return collision;
  }

  function applyLoopsPaneDraggable ($elems) {
    $elems.draggable({
      appendTo: '.loops',
      scroll: false, // prevent scrolling
      snap: true,
      snapTolerance: 5,
      revert: 'invalid',
      handle: '.loop-name',
      opacity: 0.5,
      helper: function () {
        var $clone = $(this).clone();
        $clone.width($(this).data('options').duration * constants.pixelsPerSecond);
        return $clone;
      }
    });
  }

  function applyTracksPaneDraggable ($elem) {
    $elem.draggable({
      appendTo: '.loops',
      snap: true,
      snapTolerance: 5,
      zIndex: 10,
      revert: 'invalid',
      handle: '.loop-name',
      scrollSpeed: 10,
      opacity: 0.5,
      start: function (event, ui) {
        ui.helper.removeClass('collision');
      }
    });
  }

  function applyTracksPaneDroppable ($elems) {
    $elems.droppable({
      hoverClass: 'track-hover',
      accept: '.loop',
      drop: function (event, ui) {
        var $track = $(this);
        var trackIndex = $track.index('.track');

        // Don't drop if it has collision
        if (hasCollision($track, ui.helper)) {
          // Move it back!
          ui.draggable.draggable('option', 'revert', true);
          ui.helper.addClass('collision');
          return;
        }

        // Set back the invalid revert option
        ui.draggable.draggable('option', 'revert', 'invalid');

        // Moving from track to track
        if (ui.helper.hasClass('track-loop')) {
          var prevTrackIndex = ui.draggable.parent().index('.track');
          // Add loop to the current track
          $track.append(ui.draggable);

          // Fix vertical align
          ui.draggable.css('top', 0);

          // Fire the event
          events.trigger('move', {
            prevTrackIndex: prevTrackIndex,
            trackIndex: trackIndex,
            id: ui.draggable.attr('id')
          });
          return;
        }

        // Moving from loop pane to track
        var left = loopHelper.left(ui.helper);
        var loopData = ui.draggable.data('options');
        loopData.inTrack = true;
        // var loopView = new LoopPlayerView();
        // var $loop = ui.helper.clone();

        // Don't loop the audio anymore
        // var audio = loopHelper.audio($loop);
        // audio.loop = false;
        // audio.oncanplaythrough = function () {
        //   $loop.data('buffered', true);
        // };

        // Position the loop 
        // $loop.css({
        //   left: left,
        //   top: 0,
        //   opacity: 1
        // });

        // Add class for styling and to differentiate it
        // from the loops in the loops pane
        // $loop.addClass('track-loop');

        // Allow horizontal resizing
        // $loop.resizable({
        //   handles: 'e, w'
        // });

        // Add to current track
        // $track.append($loop);

        // Make it draggable again
        // applyTracksPaneDraggable($loop);

        events.trigger('new', {
          trackIndex: trackIndex,
          loopData: loopData,
          left: left
        });
      }
    });
  }

  return {
    applyLoopsPaneDraggable: applyLoopsPaneDraggable,
    applyTracksPaneDraggable: applyTracksPaneDraggable,
    applyTracksPaneDroppable: applyTracksPaneDroppable,
    events: events
  };
});