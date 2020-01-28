define(function (require, exports, module) {// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', {
  RAD_PER_DEG: 180 / Math.PI
});
});
