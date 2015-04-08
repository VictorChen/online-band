define([
  'backbone',
  'jquery',
  'underscore',
  '../util/drag_drop_helper',
  'text!../templates/tracks_pane.html',
  'jquery_ui/ui/droppable',
  'jquery_ui/ui/resizable'
],

function (Backbone, $, _, dragDropHelper, Template) {
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