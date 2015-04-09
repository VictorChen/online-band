define([
  'backbone',
  'jquery',
  'underscore',
  '../util/drag_drop_helper',
  '../util/loop_helper',
  'text!../templates/tracks_pane.html',
  'jquery_ui/ui/droppable',
  'jquery_ui/ui/resizable'
],

function (Backbone, $, _, dragDropHelper, loopHelper, Template) {
  'use strict';

  return Backbone.View.extend({
    template: _.template(Template),
    events: {
      'click .add-track': 'addTrack'
    },
    initialize: function () {
      this.listenTo(dragDropHelper.events, 'drop', this.resizeTracks);
    },
    resizeTracks: function ($track, $loop) {
      var trackWidth = $track.width();
      var rightPosition = loopHelper.right($loop);
      if (Math.abs(trackWidth - rightPosition) < 500) {
        this.$('.track').width(trackWidth*1.5);
      }
    },
    addTrack: function () {
      var $track = $('<div class="track"></div>');
      var $trackInfo = $('<div class="track-info"></div>');
      var $trackName = $('<div class="track-name">Track</div>');
      this.$('.loops').append($track);
      dragDropHelper.applyTracksPaneDroppable($track);
      $trackInfo.append($trackName);
      $trackInfo.insertBefore(this.$('.add-track'));
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