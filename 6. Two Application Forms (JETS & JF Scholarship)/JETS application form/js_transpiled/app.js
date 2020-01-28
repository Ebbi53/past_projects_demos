define(['jquery', 'underscore', 'backbone', 'bootstrap', 'router'], function ($, _, Backbone, Bootstrap, Router) {
  var init = function init() {
    Backbone.history.start();
  };

  return {
    init: init
  };
});