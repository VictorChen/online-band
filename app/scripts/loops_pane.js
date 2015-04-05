require([
  'jquery',
  'underscore',
  'text!../templates/category_button.html',
  'text!../templates/loop_available.html'
],

function ($, _, CategoryTemplate, LoopTemplate) {
  'use strict';

  var $el = $('.loops-pane');
  var $categories = $el.find('.categories');
  var $loopsAvailable = $el.find('.loops-available');
  var categories = {};
  var categoryButtonTemplate = _.template(CategoryTemplate);
  var loopAvailableTemplate = _.template(LoopTemplate);

  // TODO: Fetch loops from a database!
  // For now, we'll simulate it by fetching a JSON file
  $.getJSON('loops.json', function (loops) {
    _.each(loops, function (loop) {
      categories[loop.category] = categories[loop.category] || [];
      categories[loop.category].push(loop);
    });

    _.each(categories, function (loops, category) {
      $categories.append(categoryButtonTemplate({
        category: category
      }));
    });
  });

  $el.on('click', '.category-button', function () {
    var category = $(this).text();
    $(this).toggleClass('active').siblings().removeClass('active');
    $loopsAvailable.empty();
    _.each(categories[category], function (loop) {
      $loopsAvailable.append(loopAvailableTemplate(loop));
    });
  });

});