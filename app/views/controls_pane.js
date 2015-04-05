define([
  'backbone',
  'jquery',
  'underscore',
  'text!../templates/controls_pane.html'
],

function (Backbone, $, _, template) {
  'use strict';

  return Backbone.View.extend({
    render: function () {
      this.$el.html(template);
      return this;
    }
  });
});