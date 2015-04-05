define([
  'jquery',
  'underscore',
  'backbone',
  'models/category'
],

function ($, _, Backbone, categoryModel) {
  'use strict';

  return Backbone.Model.extend({
    /**
     * TODO: Need a RESTful backend!
     * For now, fetch from json files
     */
    url: 'categories.json', // should really just be /categories
    parse: function (categories) {
      var categoryModels = _.map(categories, function (name, key) {
        return new categoryModel({
          id: key + '.json', // shouldn't need the .json...
          name: name
        });
      });

      return {
        collection: new Backbone.Collection(categoryModels)
      };
    }
  });
});