//entry point for require.js
require.config({
    baseURI: 'js',
    paths: {
        hello: 'lib/hello/hello.all.min',
        jquery: 'lib/jquery-1.12.4.min',
        underscore: 'lib/underscore-min',
        backbone: 'lib/backbone-min',
        bootstrap: 'lib/bootstrap/js/bootstrap.min',
        respond: 'lib/respond',
        nanoscroller: 'plugin/nanoscroller/jquery.nanoscroller.min',
        datatable: 'plugin/datatable/jquery.dataTables.min',
        datepicker: 'plugin/datepicker/bootstrap-datepicker',
        cookie: 'plugin/cookie/jquery.cookie',
        moment: 'lib/moment.min',
        highcharts: 'lib/highcharts/5.0.6/code/highcharts',
        hammerjs: 'lib/hammer.min',
        jqhammer: 'lib/jqham',
        jqconfirm: 'lib/jquery-confirm-master/dist/jquery-confirm.min',
     
    },

    shim: {
        'hello': {
            exports: 'hello'
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['jqhammer', 'underscore', 'jquery'],
            exports: 'Backbone'
        },

        'respond': {
            deps: ['bootstrap'],
            exports: 'Respond'
        },
        'nanoscroller': {
            deps: ['jquery'],
            exports: 'nanoScroller'
        },
        'datepicker': {
            deps: ['jquery'],
            exports: 'datepicker'
        },
        'jqconfirm': {
            deps: ['jquery','bootstrap'],
            exports: 'jqconfirm'
        }
    },


});

define('moduleConfig', {
    runtime: {},
    //v2 token test flight
    modelBaseUrlRoot: 'https://ghrappsaws.ehrdesign.com/fmi/xml/FMPXMLRESULT.xml',
    modelDefaultActionParam: {
        '-new': '',
        '-lay': 'trx',
        '-db': 'LeaveInputDevIbrahim',
        '-script': 'actionKeeper'
    }
});

require([
    'app',
    'file_maker_setting'
], function (App, fileMakerSetting) {
    if (!Array.isArray) {
        Array.isArray = function (arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };
    }
    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {
        Object.keys = (function () {
            'use strict';
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function (obj) {
                if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                    throw new TypeError('Object.keys called on non-object');
                }

                var result = [], prop, i;

                for (prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) {
                        result.push(prop);
                    }
                }

                if (hasDontEnumBug) {
                    for (i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        }());
    }


    App.init();
});