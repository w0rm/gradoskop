define(function (require) {

  'use strict';

  var Backbone = require('backbone')

  return Backbone.Model.extend({

    toJSON: function () {
      return _.pick( this.attributes
                   , 'xml'
                   , 'path'
                   , 'latitude'
                   , 'longitude'
                   , 'description'
                   , 'ath'
                   , 'atv'
                   , 'version'
                   , 'created_at'
                   , 'is_active'
                   )
    }

  })

})
