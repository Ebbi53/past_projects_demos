
// entry point of the application logic
define(['jquery', 'underscore', 'backbone', 'router'], function ($, _, Backbone, Router) {
  var init = function init() {
    Router.init();
    $.support.cors = true;
  };

  return {
    init: init
  };
});