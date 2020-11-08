define(function (require) {

  'use strict';

  var $ = require('jquery')
  var krpano = require('krpano')
  var Backbone = require('backbone')
  var vent = require('vent')
  var utils = require('utils')
  var cid = 0


  return Backbone.View.extend({

    initialize: function (options) {
      this.options = options || {}
      this.router = this.options.router
      this.cid = ++cid
      this.listenTo(vent, {
        'pano:change': this.onPanoChange
      , 'pano:ready': this.onKrpanoReady
      , 'pano:viewchange': this.onPanoViewChange
      })
      this.args = {}
    }

  , render: function () {
      this.$el.attr('id', 'pano-' + this.cid)
      krpano.embed({
        swf: '/static/pano/krpano.swf'
      , js: '/static/pano/krpano.js'
      , xml: '/static/pano/skin.xml'
      , target: 'pano-' + this.cid
      , id: 'krpano-' + this.cid
      , bgcolor: '#000000'
      , html5: 'prefer'
      , vars: {pano_id: this.cid}
      })
      return this
    }

  , remove: function () {
      krpano.remove('krpano-' + this.cid)
    }

  , onPanoChange: function (pano_id, url, ath, atv) {
      if (pano_id !== this.cid) return;
      var path = utils.parseURL(url).pathname
      if (!this.router) return;
      this.args = {ath: ath, atv: atv}
      this.router.navigate(path, {trigger: true})
    }

  , navigate: function (pano, args) {
      var baseUrl = (pano ? '/' : '') + pano;
      var url;
      args = args || this.args;
      if (args && args.ath && args.atv) {
        url = baseUrl + '/index_' + args.ath + '_' + args.atv + '.xml';
      } else {
        url = baseUrl + '/index.xml';
      }
      this.args = {}
      this.callApi('navigate("' + url + '");');
    }

  , get: function (param) {
      return this.api && this.api.get(param)
    }

  , onKrpanoReady: function (pano_id) {
      if (pano_id !== this.cid) return;
      this.api = document.getElementById('krpano-' + this.cid)
      if (this.savedMethod) {
        this.api.call(this.savedMethod)
        delete this.savedMethod
      }
    }

  , onPanoViewChange: function (pano_id, ath, atv) {
      if (pano_id !== this.cid) return;
      this.trigger('pano:viewchange', ath, atv)
    }

  , callApi: function (method) {
      if (this.api) {
        this.api.call(method)
      } else {
        this.savedMethod = method
      }
    }

  })

})
