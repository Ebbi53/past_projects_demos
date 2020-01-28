define(function (require, exports, module) {require('../../modules/core.number.iterator');

var get = require('../../modules/_iterators').Number;

module.exports = function (it) {
  return get.call(it);
};
});
