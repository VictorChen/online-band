define([
  'backbone',
  'jquery',
  'underscore',
  'text!../templates/loops_pane.html',
  'text!../templates/loop_available.html',
  'jqueryui/ui/draggable'
],

function (Backbone, $, _, Template, LoopTemplate) {
  'use strict';

  var loopAvailableTemplate = _.template(LoopTemplate);

  return Backbone.View.extend({
    template: _.template(Template),
    events: {
      'click .category-button': 'showCategoryLoops'
    },
    initialize: function (options) {
      this.collection = options.collection;
    },
    createCategory: function (categoryModel, $categoryContainer) {
      categoryModel.fetch().done(function (loops) {
        _.each(loops, function (loop) {
          $categoryContainer.append(loopAvailableTemplate(loop));
        });

        $categoryContainer.find('.loop-available').draggable({
          appendTo: '.left-pane',
          helper: 'clone'
        });
      });
    },
    showCategoryLoops: function (event) {
      var $categoryButton = $(event.currentTarget),
          category = $categoryButton.data('category'),
          $categoryContainer = this.$('.category-loops[data-category="' + category +'"]'),
          categoryModel = this.collection.get(category);

      // Set as active category
      $categoryButton.toggleClass('active').siblings().removeClass('active');

      if (!$categoryButton.hasClass('active')) {
        // We have no active category, don't show anything!
        $categoryContainer.hide();
        return;
      }

      // Category hasn't been created yet
      if (!categoryModel.get('loops')) {
        this.createCategory(categoryModel, $categoryContainer);
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