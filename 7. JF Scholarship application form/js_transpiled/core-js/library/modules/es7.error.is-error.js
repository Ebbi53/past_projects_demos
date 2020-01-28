define(function (require, exports, module) {// https://github.com/ljharb/proposal-is-error
var $export = require('./_export');

var cof = require('./_cof');

$export($export.S, 'Error', {
  isError: function isError(it) {
    return cof(it) === 'Error';
  }
});
});
