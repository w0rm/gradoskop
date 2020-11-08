define(function (require) {

  'use strict';

  var Backbone = require('backbone')
  var vent = new Backbone.Model()

  window.onpanochange = function (pano_id, path, ath, atv) {
    vent.trigger('pano:change', parseInt(pano_id, 10), path, ath, atv)
  }

  window.onpanoready = function (pano_id) {
    vent.trigger('pano:ready', parseInt(pano_id, 10))
  }

  window.onpanoviewchange = function (pano_id, ath, atv) {
    vent.trigger('pano:viewchange', parseInt(pano_id, 10), ath, atv)
  }

  return vent

})
