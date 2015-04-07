define([
  'backbone',
  'jquery',
  'underscore',
  'text!../templates/tracks_pane.html',
  'jquery_ui/ui/droppable',
  'jquery_ui/ui/resizable'
],

function (Backbone, $, _, Template) {
  'use strict';

  return Backbone.View.extend({
    template: _.template(Template),
    events: {
      'click .add-track': 'addTrack'
    },
    addTrack: function () {
      var $track = $('<div class="track"></div>');
      var $trackInfo = $('<div class="track-info"></div>');
      var $trackName = $('<div class="track-name">Track</div>');
      this.$('.loops').append($track);
      this.makeDroppable($track);
      $trackInfo.append($trackName);
      $trackInfo.insertBefore(this.$('.add-track'));
    },
    makeDroppable: function ($track) {
      $track.droppable({
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
            // TODO: rethink this
            $loop.css('left', position.left - 105);
            $loop.addClass('track-loop');
            $loop.width($loop.attr('duration') * 50);
            $loop.resizable({
              handles: 'e, w'
            });
            $(this).append($loop);
            $loop.draggable({
              appendTo: '.loops',
              snap: true,
              snapTolerance: 5,
              revert: 'invalid'
            });
          } else {
            $(this).append(ui.draggable);
            ui.draggable.css('top', 0);
          }
        }
      });
    },
    syncScrollbars: function () {
      var self = this;
      this.$('.loops').scroll(function () { 
        self.$('.tracks').scrollTop($(this).scrollTop());
      });
    },
    render: function () {
      this.$el.html(this.template({}));
      this.syncScrollbars();
      return this;
    }
  });
});