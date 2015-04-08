define([
  'jquery',
  'underscore',
  'backbone',
  'models/category'
],

function ($, _) {
  'use strict';

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
      opacity: 0.5
    });
  }

  function applyTracksPaneDroppable ($elems) {
    $elems.droppable({
      hoverClass: "track-hover",
      accept: function ($draggable) {
        var currentDropOffset = $draggable.offset();
        $draggable.siblings().each(function () {
          var offset = $(this).offset();            
        })
        return true;
      },
      drop: function (event, ui) {
        if (!ui.helper.hasClass('track-loop')) {
          var position = ui.position;
          var $loop = ui.draggable.clone();
          $loop.find('audio').removeAttr('loop');
          $loop.css('left', position.left);
          $loop.addClass('track-loop');
          $loop.width($loop.attr('duration') * 50);
          $loop.resizable({
            handles: 'e, w'
          });
          $(this).append($loop);
          applyTracksPaneDraggable($loop);
        } else {
          $(this).append(ui.draggable);
          ui.draggable.css('top', 0);
        }
      }
    });
  }

  return {
    applyLoopsPaneDraggable: applyLoopsPaneDraggable,
    applyTracksPaneDraggable: applyTracksPaneDraggable,
    applyTracksPaneDroppable: applyTracksPaneDroppable
  }
});