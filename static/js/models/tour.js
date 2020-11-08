define(function (require) {

  'use strict';

  var _ = require('underscore')
  var Backbone = require('backbone')
  var PanosCollection = require('collections/panos')

  return Backbone.Model.extend({

    initialize: function (attributes) {
      this.parse(attributes)
    }

  , initSubmodels: function () {
      this.panos = this.panos || new PanosCollection()
    }

  , parse: function (response) {
      this.initSubmodels()
      if (response) {
        this.panos.set(response.panos)
      }
      return response
    }

  , toJSON: function () {
      return _.pick( this.attributes
                   , 'title'
                   , 'slug'
                   , 'description'
                   , 'created_at'
                   , 'is_active'
                   , 'is_commercial'
                   )
    }

  })

})
