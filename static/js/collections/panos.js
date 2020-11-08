define(function(require) {

  'use strict';

  var Backbone = require('backbone')
  var PanoModel = require('models/pano')

  return Backbone.Collection.extend({

    model: PanoModel

  })

})
