define([
  'backbone',
  'jquery',
  'underscore',
  'text!../templates/loops_pane.html',
  'text!../templates/loop_available.html'
],

function (Backbone, $, _, Template, LoopTemplate) {
  'use strict';

  var loopAvailableTemplate = _.template(LoopTemplate);

  return Backbone.View.extend({
    template: _.template(Template),
    events: {
      'click .category-button': 'fetchCategoryLoops'
    },
    categories: {},
    initialize: function (options) {
      this.collection = options.collection;
    },
    fetchCategoryLoops: function (event) {
      var $categoryButton = $(event.currentTarget);
      var category = $categoryButton.data('category');
      var $categoryContainer = this.$('.category-loops[data-category="' + category +'"]');

      $categoryButton.toggleClass('active').siblings().removeClass('active');

      if (!$categoryButton.hasClass('active')) {
        $categoryContainer.hide();
        return;
      }

      var categoryModel = this.collection.get(category);
      if (!categoryModel.get('loops')) {
        categoryModel.fetch().done(function (loops) {
          _.each(loops, function (loop) {
            $categoryContainer.append(loopAvailableTemplate(loop));
          });
        });
      }
      $categoryContainer.fadeIn('slow').siblings().hide();
    },
    render: function () {
      this.$el.html(this.template({
        categories: this.collection.toJSON()
      }));
      return this;
    }
  });
});