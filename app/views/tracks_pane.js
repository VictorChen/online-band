define([
  'backbone',
  'jquery',
  'underscore',
  'text!../templates/tracks_pane.html',
  'jqueryui/ui/droppable'
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
      $track.droppable({
        hoverClass: "track-hover",
        drop: function() {
          alert( "dropped" );
        }
      });
      this.$('.loops').append($track);
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