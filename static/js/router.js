define(function (require) {

  'use strict';

  var Backbone = require('backbone')
  var utils = require('utils')

  return Backbone.Router.extend({

    routes: {
      '*path': 'page'
    }

  , execute: function (callback, args) {
      args.push(utils.parseQueryString(args.pop()))
      if (callback) callback.apply(this, args)
    }

  })

})
