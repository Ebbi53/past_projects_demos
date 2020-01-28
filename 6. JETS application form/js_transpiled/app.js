define(['jquery', 'underscore', 'backbone', 'bootstrap', 'router'], function ($, _, Backbone, Bootstrap, Router) {
  var init = function init() {
    // console.log(Router)
    Backbone.history.start(); // Backbone.history.start();

    console.log('init');
  };

  return {
    init: init
  };
});