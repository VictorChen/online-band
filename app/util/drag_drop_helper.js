define([
  'jquery',
  'underscore',
  'backbone',
  'models/category'
],

function ($, _) {
  'use strict';

  function hasCollision ($track, $loop) {
    var collision = false;
    var width = $loop.outerWidth();
    var left = parseFloat($loop.css('left'));
    var right = left + width;

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
        var currentLeft = parseFloat($this.css('left'));
        var currentRight = currentLeft + $this.outerWidth();
        if ((currentLeft < left && currentRight > left) ||
          (currentLeft > left && currentLeft < right)) {
          collision = true;
          return;
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
        $clone.width($(this).attr('duration') * 50);
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
      drop: function (event, ui) {
        // Don't drop if it has collision
        if (hasCollision($(this), ui.helper)) {
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
          $(this).append(ui.draggable);

          // Fix vertical align
          ui.draggable.css('top', 0);
          return;
        }

        // Moving from loop pane to track
        var left = parseFloat(ui.helper.css('left'));
        var $loop = ui.helper.clone();

        // Don't loop the audio anymore
        $loop.find('audio').removeAttr('loop');

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
        $(this).append($loop);

        // Make it draggable again
        applyTracksPaneDraggable($loop);
      }
    });
  }

  return {
    applyLoopsPaneDraggable: applyLoopsPaneDraggable,
    applyTracksPaneDraggable: applyTracksPaneDraggable,
    applyTracksPaneDroppable: applyTracksPaneDroppable
  }
});