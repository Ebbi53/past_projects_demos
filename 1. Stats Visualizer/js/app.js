define(['jquery', 'underscore', 'backbone', 'bootstrap', 'router'], function ($, _, Backbone, Bootstrap, Router) {

    var version = 1.2

    var init = function () {
        ('Version: ' + version);
        Backbone.history.start(); // Backbone.history.start();
    }
    return {
        init: init,
    }
});