//entry point for require.js
require.config({
    baseURI: 'js',
    // urlArgs: "bust=" + _version,
    paths: {
        'jquery': '../lib/jquery-3.4.1',
        'underscore': '../lib/underscore',
        'backbone': '../lib/backbone',
        'text': '../lib/text',
        'bootstrap': '../lib/bootstrap-4.3.1/dist/js/bootstrap.bundle',
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
    },
    map: {
        // // '*' means all modules will get 'jquery-private'
        // // for their 'jquery' dependency.
        // '*': { 'jquery': 'jquery-private' },

        // // 'jquery-private' wants the real jQuery module
        // // though. If this line was not here, there would
        // // be an unresolvable cyclic dependency.
        // 'jquery-private': { 'jquery': 'jquery' }
    }
});

require(['app'], function (App) {
    App.init();
})
