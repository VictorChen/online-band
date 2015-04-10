define([
  'jquery',
  'underscore',
  'backbone',
  './loop_helper'
],

function ($, _, Backbone, loopHelper) {
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
      opacity: 0.5,
      helper: function () {
        var $clone = $(this).clone();
        // Firefox copies the css as inline styles... why??
        $clone.removeAttr('style');
        $clone.width($(this).data('duration') * 50);
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
      scrollSpeed: 10,
      opacity: 0.5,
      start: function (event, ui) {
        ui.helper.removeClass('collision');
      }
    });
  }

  function applyTracksPaneDroppable ($elems) {
    $elems.droppable({
      hoverClass: "track-hover",
      accept: '.track-loop, .loop-available',
      drop: function (event, ui) {
        var $track = $(this);

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
          // Add loop to the current track
          $track.append(ui.draggable);

          // Fix vertical align
          ui.draggable.css('top', 0);
          events.trigger('drop', $track, ui.draggable);
          return;
        }

        // Moving from loop pane to track
        var left = loopHelper.left(ui.helper);
        var $loop = ui.helper.clone();

        // Don't loop the audio anymore
        var audio = loopHelper.audio($loop);
        audio.loop = false;
        audio.oncanplaythrough = function () {
          $loop.data('buffered', true);
        };

        // Position the loop 
        $loop.css({
          left: left,
          top: 0,
          opacity: 1
        });

        // Add class for styling and to differentiate it
        // from the loops in the loops pane
        $loop.addClass('track-loop');

        // Allow horizontal resizing
        $loop.resizable({
          handles: 'e, w'
        });

        // Add to current track
        $track.append($loop);

        // Make it draggable again
        applyTracksPaneDraggable($loop);

        events.trigger('drop', $track, $loop);
      }
    });
  }

  return {
    applyLoopsPaneDraggable: applyLoopsPaneDraggable,
    applyTracksPaneDraggable: applyTracksPaneDraggable,
    applyTracksPaneDroppable: applyTracksPaneDroppable,
    events: events
  }
});