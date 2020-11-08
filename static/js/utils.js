define(function () {

  'use strict';

  return {
    parseQueryString: function () {
      return {}
    }

  , parseURL: function (url) {
      var el = document.createElement('a');
      el.href = url
      return {
        pathname: el.pathname
      , search: el.search
      }
    }
  }

})
