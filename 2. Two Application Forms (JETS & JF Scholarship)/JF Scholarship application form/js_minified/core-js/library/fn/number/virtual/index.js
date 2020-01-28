define(function (require, exports, module) {require('../../../modules/core.number.iterator');

var $Number = require('../../../modules/_entry-virtual')('Number');

$Number.iterator = require('../../../modules/_iterators').Number;
module.exports = $Number;
});
