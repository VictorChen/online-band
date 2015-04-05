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
      this.$('.loops').append('<div class="track"></div>');
      $('<div class="track-info"><div class="track-name">Track</div></div>').insertBefore(this.$('.add-track'));
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