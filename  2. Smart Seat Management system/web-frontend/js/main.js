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
        'timer': '../plugin/harshen-jQuery-countdownTimer-c9afa61/jquery.countdownTimer'
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
        // WxECl4QxNurMk1SJgQF5Z8Zua9ffr7QwfYLBlM7ZsusiAgz6Am4KtrKLQFwQ
        // // 'jquery-private' wants the real jQuery module
        // // though. If this line was not here, there would
        // // be an unresolvable cyclic dependency.
        // 'jquery-private': { 'jquery': 'jquery' }
    }
});

require(['app'], function (App) {
    App.init();
})
