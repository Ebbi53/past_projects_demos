//entry point for require.js
require.config({
  baseURI: 'js',
  urlArgs: "bust=" + _version,
  paths: {
    es6: 'lib/requirejs-babel/es6',
    babel: 'lib/requirejs-babel/babel-5.8.34.min',
    hello: 'lib/hello/hello.all.min',
    jquery: 'lib/jquery-1.12.4.min',
    //undo min version
    underscore: 'lib/underscore-min',
    backbone: 'lib/backbone-min',
    bootstrap: 'lib/bootstrap/js/bootstrap',
    //undo min version
    respond: 'lib/respond',
    nanoscroller: 'plugin/nanoscroller/jquery.nanoscroller.min',
    dataTables: 'plugin/DataTables/DataTables-1.10.18/js/jquery.dataTables',
    //undo min version
    // dataTables_buttons: 'plugin/DataTables/Buttons-1.5.4/js/dataTables.buttons', //undo min version
    dataTables_fixedHeader: 'plugin/DataTables/FixedHeader-3.1.4/js/dataTables.fixedHeader',
    //undo min version
    dataTables_responsive: 'plugin/DataTables/Responsive-2.2.2/js/dataTables.responsive',
    //undo min version
    dataTables_rowGroup: 'plugin/DataTables/RowGroup-1.1.0/js/dataTables.rowGroup',
    //undo min version
    // dataTables_scroller: 'plugin/DataTables/Scroller-1.5.0/js/dataTables.scroller', //undo min version
    datepicker: 'plugin/datepicker/bootstrap-datepicker',
    cookie: 'plugin/cookie/jquery.cookie',
    moment: 'lib/moment.min',
    highcharts: 'lib/Highcharts/5.0.6/code/highcharts',
    hammerjs: 'lib/hammer.min',
    jqhammer: 'lib/jqham',
    jqconfirm: 'lib/jquery-confirm-master/dist/jquery-confirm.min'
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
    'dataTables': {
      deps: ['jquery']

    },
    'script': {
      deps: ['dataTables', 'dataTables_fixedHeader', 'dataTables_responsive', 'dataTables_rowGroup']
    },
    'jqconfirm': {
      deps: ['jquery', 'bootstrap'],
      exports: 'jqconfirm'
    }
  },
  map: {
    '*': {
      'datatables.net': 'dataTables',
      'datatables.net-buttons': 'dataTables_buttons',
      'datatables.net-fixedHeader': 'dataTables_fixedHeader',
      'datatables.net-responsive': 'dataTables_responsive',
      'datatables.net-rowGroup': 'dataTables_rowGroup'
    }
  }
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

require(['app', 'file_maker_setting'], function (App, fileMakerSetting) {
  if (!Array.isArray) {
    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  } // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys


  if (!Object.keys) {
    Object.keys = function () {
      'use strict';

      var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !{
          toString: null
        }.propertyIsEnumerable('toString'),
        dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
        dontEnumsLength = dontEnums.length;
      return function (obj) {
        if (_typeof(obj) !== 'object' && (typeof obj !== 'function' || obj === null)) {
          throw new TypeError('Object.keys called on non-object');
        }

        var result = [],
          prop,
          i;

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
    }();
  }

  App.init();
});