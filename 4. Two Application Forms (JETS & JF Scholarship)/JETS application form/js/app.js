define(['jquery', 'underscore', 'backbone', 'bootstrap', 'router'], function($, _, Backbone, Bootstrap, Router) {

    var init = function() {
        Backbone.history.start(); // Backbone.history.start();
    }
    return {
        init: init,
    }
});