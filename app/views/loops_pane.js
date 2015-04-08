define([
  'backbone',
  'jquery',
  'underscore',
  '../util/drag_drop_helper',
  'text!../templates/loops_pane.html',
  'text!../templates/loop_available.html',
  'jquery_ui/ui/draggable'
],

function (Backbone, $, _, dragDropHelper, Template, LoopTemplate) {
  'use strict';

  var loopAvailableTemplate = _.template(LoopTemplate);

  return Backbone.View.extend({
    template: _.template(Template),
    events: {
      'click .hover-button': 'showCategoryLoops'
    },
    initialize: function (options) {
      this.collection = options.collection;
    },
    createCategory: function (categoryModel, $categoryContainer) {
      categoryModel.fetch().done(function (loops) {
        _.each(loops, function (loop) {
          var $newLoop = $(loopAvailableTemplate(loop));
          $newLoop.find('audio').on('loadedmetadata', function () {
            $newLoop.attr('duration', $(this)[0].duration);
          });
          $categoryContainer.append($newLoop);
        });

        var $newLoops = $categoryContainer.find('.loop-available');
        dragDropHelper.applyLoopsPaneDraggable($newLoops);
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