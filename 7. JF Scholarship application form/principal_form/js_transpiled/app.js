

define(['jquery', 'underscore', 'backbone', 'bootstrap', 'router'], function ($, _, Backbone, Bootstrap, Router) {
    var version = 1.0
    var init = function init() {
        console.log('Version: ' + version);
        Backbone.history.start(); // Backbone.history.start();
    };

    return {
        init: init
    };
});