define(function (require, exports, module) {require('../../modules/es6.regexp.flags');

var flags = require('../../modules/_flags');

module.exports = function (it) {
  return flags.call(it);
};
});
