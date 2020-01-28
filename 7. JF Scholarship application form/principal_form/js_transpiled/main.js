

//entry point for require.js
require.config({
    baseURI: 'js_transpiled',
    // urlArgs: "bust=" + _version,
    paths: {
        'jquery': '../lib/jquery-3.4.1',
        'underscore': '../lib/underscore',
        'backbone': '../lib/backbone',
        'text': '../lib/text',
        'bootstrap': '../lib/bootstrap-4.3.1/dist/js/bootstrap.bundle',
        'jquery.ui.widget': '../plugin/jquery-file-upload/js/vendor/jquery.ui.widget',
        'jquery.iframe-transport': '../plugin/jquery-file-upload/js/jquery.iframe-transport',
        'fileUpload': '../plugin/jquery-file-upload/js/jquery.fileupload',
        'template': '../js/template/'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'fileUpload': {
            deps: ['jquery'],
            exports: 'fileUpload'
        },
        'script': {
            deps: ['fileUpload', 'fileUploadUI', 'fileUploadIframe']
        }
    }
});

require(['app'], function (App) {
    App.init();
});