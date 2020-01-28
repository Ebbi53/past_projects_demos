define(['jquery', 'underscore', 'backbone', 'bootstrap', 'router'], function($, _, Backbone, Bootstrap, Router) {

    var init = function() {
        // console.log(Router)
        Backbone.history.start(); // Backbone.history.start();
        console.log('init');
    }
    return {
        init: init,
    }
});