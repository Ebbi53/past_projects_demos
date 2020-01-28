define(['jquery', 'underscore', 'backbone', 'bootstrap', 'router'], function ($, _, Backbone, Bootstrap, Router) {

    var version = 1.0

    var init = function () {
        console.log('Version: ' + version);
        Backbone.history.start(); // Backbone.history.start();
        console.log('init');
    }
    return {
        init: init,
    }
});