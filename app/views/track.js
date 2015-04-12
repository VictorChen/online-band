define([
  'backbone',
  '../util/drag_drop_helper'
],

function (Backbone, dragDropHelper) {
  'use strict';

  var InfoView = Backbone.View.extend({
    template: function () {
      return '<div class="track-name">Track</div>';
    },
    className: 'track-info',
    render: function () {
      this.$el.html(this.template());
      return this;
    }
  });

  var LoopsView = Backbone.View.extend({
    className: 'track',
    render: function () {
      dragDropHelper.applyTracksPaneDroppable(this.$el);
      return this;
    }
  });

  return Backbone.View.extend({
    initialize: function () {
      this.infoView = new InfoView().render();
      this.loopsView = new LoopsView().render();
    }
  });
});