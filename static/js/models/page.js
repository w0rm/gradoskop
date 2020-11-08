define(function (require) {

  'use strict';

  var _ = require('underscore')
  var Backbone = require('backbone')
  var TourModel = require('models/tour')
  var PanoModel = require('models/pano')
  var tours = ['tour', 'next', 'prev']

  /*

    {
      tour: TourModel
      prev: TourModel
      next: TourModel
      pano: PanoModel
    }

   */


  return Backbone.Model.extend({

    initialize: function (attributes) {
      this.parse(attributes)
    }

  , initSubmodels: function () {
      _.each(tours, function (name) {
        this[name] = this[name] || new TourModel()
      }, this)
      this.pano = this.pano || new PanoModel()
    }

  , parse: function (response) {
      this.initSubmodels()
      if (response) {
        _.each(tours, function (name) {
          this[name].set(response[name])
        }, this)
        this.pano.set(response.pano)
      }
      return response
    }

  })

})
