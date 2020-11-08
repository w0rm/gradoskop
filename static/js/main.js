/* Public site entry point */

var scripts = document.getElementsByTagName('script')
  , src = scripts[scripts.length - 1].src
  , baseUrl = src.substring( src.indexOf(document.location.pathname)
                           , src.lastIndexOf('/'))

require.config({
  baseUrl: baseUrl
, paths: {
    modernizr: 'vendor/modernizr-2.6.2'
  , krpano: '../pano/embedpano'
  , jquery: 'vendor/jquery-1.9.1'
  , backbone: 'vendor/backbone'
  , underscore: 'vendor/underscore'
  , yashare: '//yandex.st/share/share'
  }
, shim: {
    modernizr: {exports: 'Modernizr'}
  , krpano: {
      init: function () {
        'use strict';
        return { embed: this.embedpano
               , remove: this.removepano
               }
      }
    }
  , yashare: {exports: 'Ya'}
  }
})
