define(function (require) {

  'use strict';

  var Backbone = require('backbone')
  var Router = require('router')
  var PageModel = require('models/page')
  var PanoView = require('views/pano')
  var Ya = require('yashare')
  var ga = require('analytics')
  var utils = require('utils')

  return Backbone.View.extend({

    events: {
      'click .js-link': 'onLinkClick'
    }

  , initialize: function () {
      this.router = new Router()
      this.model = new PageModel()
      this.panoView = new PanoView({router: this.router})
      this.listenTo(this.router, 'route:page', this.onPageChange)
      this.listenTo(this.model, {
        'change:prev': this.renderPrev
      , 'change:next': this.renderNext
      , 'change:tour': this.renderTour
      , 'change:pano': this.renderPano
      })
    }

  , onPageChange: function (path) {
      var url = path
        ? path.indexOf('/') === 0
          ? path + '/index.json'
          : '/' + path + '/index.json'
        : '/index.json';
      this.model.fetch({url:  url})
      this.panoView.navigate(path || '')
      this.currentPath = utils.parseURL(path).pathname
    }

  , render: function () {
      this.panoView.setElement(this.$('.js-pano')).render()
      this.yaShare = new Ya.share({
        element: this.$('.js-yashare').get(0)
      , elementStyle: {
          type: 'link'
        , linkIcon: false
        , linkUnderline: true
        , quickServices: ['vkontakte', 'twitter', 'facebook']
        }
      });
      Backbone.history.start({pushState: true})
      return this
    }

  , renderPrev: function () {
      var prev = this.model.get('prev')
      if (prev) {
        this.$('.viewport .prev')
          .show()
          .text( prev.title )
          .attr('href', '/' + prev.slug)
      } else {
        this.$('.viewport .prev').hide()
      }
    }

  , renderNext: function () {
      var next = this.model.get('next')
      if (next) {
        this.$('.viewport .next')
          .show()
          .text( next.title )
          .attr('href', '/' + next.slug)
      } else {
        this.$('.viewport .next').hide()
      }
    }

  , renderTour: function () {
      var tour = this.model.get('tour')
      document.title = tour.title
      this.$('.content h2:first').html(tour.enhanced_title)
      this.$('.tour_content .description').html(tour.enhanced_description)
    }

  , renderPano: function () {
      var pano = this.model.get('pano')
      this.$('.pano_content .note').html(pano.enhanced_description)
      this.$('.created_at').text(pano.enhanced_created_at)
      // Update share link
      this.yaShare.updateShareLink(
        'http://' + window.location.hostname + this.currentPath
      , this.model.get('tour').enhanced_title
      )
      ga.send({
        hitType: 'pageview'
      , page: this.currentPath
      , title: this.model.get('tour').enhanced_title
      })
    }

  , onLinkClick: function (e) {
      e.preventDefault()
      this.router.navigate(e.currentTarget.pathname, {trigger: true})
    }

  })

})
